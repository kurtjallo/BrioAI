"""Deterministic transcript metrics.

PRD §7 F6/F7 require these to be computed, not estimated. An LLM asked for a
"0-1 lexical diversity estimate" returns a different number each run on the
same transcript, which makes the trend line in §8 unreadable. Everything here
is reproducible: same transcript in, same numbers out.

The LLM is still responsible for judgement calls (word upgrades, where the
main point landed, how the answer ended). It is not responsible for counting.
"""

from __future__ import annotations

import collections
import re
from collections import Counter

# PRD F6. Multi-word entries are matched as phrases before tokenisation.
VAGUE_WORDS: set[str] = {
    "thing", "things", "stuff", "basically", "literally", "good", "bad",
    "nice", "very", "really", "just", "whatever",
}
VAGUE_PHRASES: tuple[str, ...] = ("kind of", "sort of", "a lot")

# PRD F5. "like" and "so" are excluded: they are far more often legitimate
# than filler, and counting them without prosody produces noise.
FILLER_WORDS: set[str] = {"um", "uh", "erm", "eh", "hmm"}
FILLER_PHRASES: tuple[str, ...] = ("you know", "i mean")

# Closed-class words are excluded from the repetition count so that "the",
# "and" and friends do not drown out real lexical repetition.
FUNCTION_WORDS: set[str] = {
    "a", "an", "the", "and", "or", "but", "if", "then", "than", "so", "because",
    "as", "of", "at", "by", "for", "with", "about", "into", "to", "from", "in",
    "on", "off", "out", "over", "under", "up", "down", "is", "am", "are", "was",
    "were", "be", "been", "being", "do", "does", "did", "have", "has", "had",
    "will", "would", "can", "could", "should", "may", "might", "must", "shall",
    "i", "you", "he", "she", "it", "we", "they", "me", "him", "her", "us",
    "them", "my", "your", "his", "its", "our", "their", "this", "that",
    "these", "those", "there", "here", "what", "which", "who", "when", "where",
    "how", "why", "not", "no", "yes", "all", "any", "some", "more", "most",
    "much", "many", "very", "too", "also", "one", "like", "get", "got", "go",
}

MATTR_WINDOW = 25
_TOKEN_RE = re.compile(r"[a-z']+")

# PRD F5 says 400ms. That number is a convention, not a finding: published
# cut-offs span 100-1000ms, and Gao, Sun & Li (2025) swept 100-1000ms and
# found 200ms best predicted fluency for MONOLOGIC tasks, which is exactly
# Cadence's format. So this is a default to be swept on real data in M1, not
# a constant to build on. Every gap is retained regardless of threshold so
# the sweep never needs re-transcription.
DEFAULT_PAUSE_THRESHOLD_MS = 400

# A gap after one of these has already been marked as a clause boundary by
# the ASR's punctuation, so it indexes conceptual planning rather than
# lexical retrieval.
_CLAUSE_ENDINGS = (".", ",", "?", "!", ";", ":", "—")

# Filled pauses are not silence, but a gap before one is still a retrieval
# event, so they must not be mistaken for content words.
_FILLED_PAUSES = FILLER_WORDS | {"er", "ah", "mhmm", "uh-huh", "mm"}


def _tokens(text: str) -> list[str]:
    return _TOKEN_RE.findall(text.lower())


def _is_function_word(word: str) -> bool:
    """Function-word test that survives contractions.

    The tokeniser keeps apostrophes so "it's" stays one token, which means a
    bare set lookup misses it and "it's" gets reported as lexical repetition.
    Check the stem before the apostrophe too.
    """
    if word in FUNCTION_WORDS:
        return True
    stem = word.split("'", 1)[0]
    return bool(stem) and stem in FUNCTION_WORDS


def _count_phrases(text: str, phrases: tuple[str, ...]) -> tuple[int, list[str]]:
    """Count non-overlapping phrase occurrences on word boundaries."""
    lowered = text.lower()
    total, found = 0, []
    for phrase in phrases:
        n = len(re.findall(rf"\b{re.escape(phrase)}\b", lowered))
        if n:
            total += n
            found.append(phrase)
    return total, found


def mattr(tokens: list[str], window: int = MATTR_WINDOW) -> float:
    """Moving-Average Type-Token Ratio, 0-1.

    Plain TTR falls mechanically as a text gets longer, so two sessions of
    different lengths are not comparable (PRD F6 calls this out). MATTR
    averages the TTR of every sliding window, which removes the length
    dependence.

    Chosen over MTLD because MTLD is unstable below ~100 tokens and a 60
    second answer is typically 130-150 words. PRD R6 flags this exact risk.
    Returns 0.0 for empty input. Below one window, falls back to plain TTR,
    which is noisy — treat single-session numbers with suspicion and prefer
    the rolling median (PRD F11).
    """
    if not tokens:
        return 0.0
    if len(tokens) <= window:
        return round(len(set(tokens)) / len(tokens), 4)

    ratios = [
        len(set(tokens[i : i + window])) / window
        for i in range(len(tokens) - window + 1)
    ]
    return round(sum(ratios) / len(ratios), 4)


def analyze_pauses(words: list, threshold_ms: float | None = None) -> dict:
    """PRD F5's pause map, computed from ASR word timings.

    `words` is a list of asr.Word (word, start, end, confidence, punctuated).

    Every inter-word gap is recorded, not just those over the threshold, so
    the threshold can be re-swept later without re-transcribing. A 60-second
    answer produces ~150 gaps, which is nothing to store and the difference
    between being able to answer "what if it were 200ms" and having to pay
    for the audio again.

    Each gap is classified:
      clause-boundary   — previous word carried sentence punctuation.
                          Conceptual planning. Normal, not the signal.
      pre-content-word  — before a content word. Lexical retrieval. THE
                          signal the product exists to detect.
      pre-filled-pause  — before "um"/"uh". Also a retrieval event.
      other             — before a function word.

    `before_zipf` carries the Zipf frequency of the following word (Zipf 7
    ~ "the", Zipf 1 ~ very rare). It is recorded because a raw
    pre-content-word count is CONFOUNDED: de Jong (2016) found both L1 and
    L2 speakers pause more before lower-frequency words, so a user
    discussing specialist topics scores as impaired while one speaking in
    platitudes scores as fluent. The construct the PRD actually wants is the
    residual after conditioning on word difficulty. That model belongs in
    the nightly baseline job (F11) where a user's own history is available;
    this function only supplies the per-word inputs it needs.
    """
    if threshold_ms is None:
        threshold_ms = DEFAULT_PAUSE_THRESHOLD_MS

    from wordfreq import zipf_frequency

    gaps = []
    for prev, nxt in zip(words, words[1:]):
        gap_ms = round((nxt.start - prev.end) * 1000, 1)
        if gap_ms <= 0:
            continue

        nxt_token = nxt.word.lower().strip()
        is_filled = nxt_token in _FILLED_PAUSES
        # Vague words are excluded from "content": reaching for "really" or
        # "thing" is the failure this product measures, not the successful
        # retrieval of a precise word. Counting a stall before a placeholder
        # as a content-word pause would inflate the headline metric with the
        # very behaviour it is supposed to penalise.
        is_content = (
            not is_filled
            and len(nxt_token) > 2
            and not _is_function_word(nxt_token)
            and nxt_token not in VAGUE_WORDS
        )
        after_clause = prev.punctuated.rstrip().endswith(_CLAUSE_ENDINGS)

        # Precedence matters. A filled pause wins over a clause boundary:
        # "um" is the speaker announcing they are still searching, and that
        # is a retrieval event wherever it lands. Deepgram also inserts
        # commas liberally, so treating any post-comma gap as conceptual
        # planning would misfile a large share of genuine stalls.
        if is_filled:
            kind = "pre-filled-pause"
        elif after_clause:
            kind = "clause-boundary"
        elif is_content:
            kind = "pre-content-word"
        else:
            kind = "other"

        gaps.append({
            "after": prev.punctuated,
            "before": nxt.punctuated,
            "gap_ms": gap_ms,
            "at_s": round(prev.end, 3),
            "kind": kind,
            "before_zipf": round(zipf_frequency(nxt_token, "en"), 2) if is_content else None,
        })

    over = [g for g in gaps if g["gap_ms"] >= threshold_ms]
    counts = collections.Counter(g["kind"] for g in over)

    return {
        "thresholdMs": threshold_ms,
        "gaps": gaps,
        "counts": {
            "total": len(over),
            "clauseBoundary": counts.get("clause-boundary", 0),
            "preContentWord": counts.get("pre-content-word", 0),
            "preFilledPause": counts.get("pre-filled-pause", 0),
            "other": counts.get("other", 0),
        },
        "longestMs": max((g["gap_ms"] for g in gaps), default=0.0),
        "totalSilenceMs": round(sum(g["gap_ms"] for g in gaps), 1),
    }


def compute(transcript: str, duration_s: float, prompt: str = "") -> dict:
    """Return the vocabulary and delivery blocks of the analysis payload.

    Shape matches what the mobile client already expects, so this is a
    drop-in replacement for the fields the LLM used to guess.

    `prompt` is the question the speaker was answering. Its content words are
    excluded from the repetition count: PRD F6 says repetition should not flag
    topic nouns. Someone answering "explain your deployment process" will say
    "deployment" repeatedly, and that is the question's fault, not theirs.
    """
    topic_words = {w for w in _tokens(prompt) if not _is_function_word(w) and len(w) > 2}
    tokens = _tokens(transcript)
    word_count = len(tokens)

    if word_count == 0:
        return {
            "vocabulary": {
                "lexicalDiversity": 0.0,
                "vagueWordDensity": 0.0,
                "vagueWords": [],
                "repetitions": [],
            },
            "delivery": {"fillerRate": 0.0, "wordCount": 0, "estimatedPace": 0},
        }

    counts = Counter(tokens)

    # Vague words: single tokens plus multi-word phrases.
    vague_hits = sum(counts[w] for w in VAGUE_WORDS)
    phrase_hits, phrases_found = _count_phrases(transcript, VAGUE_PHRASES)
    vague_hits += phrase_hits
    vague_found = sorted({w for w in VAGUE_WORDS if counts[w]} | set(phrases_found))

    # Fillers, per 100 words (PRD F5).
    filler_hits = sum(counts[w] for w in FILLER_WORDS)
    filler_phrase_hits, _ = _count_phrases(transcript, FILLER_PHRASES)
    filler_hits += filler_phrase_hits

    # Repetition: content words used 3+ times (PRD F6).
    repetitions = [
        {"word": w, "count": c}
        for w, c in counts.most_common()
        if c >= 3
        and len(w) > 2
        and not _is_function_word(w)
        and w not in VAGUE_WORDS
        and w not in topic_words
    ]

    pace = round(word_count / duration_s * 60) if duration_s > 0 else word_count

    return {
        "vocabulary": {
            "lexicalDiversity": mattr(tokens),
            "vagueWordDensity": round(vague_hits / word_count, 4),
            "vagueWords": vague_found,
            "repetitions": repetitions,
        },
        "delivery": {
            "fillerRate": round(filler_hits / word_count * 100, 2),
            "wordCount": word_count,
            "estimatedPace": pace,
        },
    }
