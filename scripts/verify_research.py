#!/usr/bin/env python3
"""
Improved non-interactive verifier for research docs.
Flexible parsing to match current markdown styles in repo:
 - market_research.md: game entries are numbered (e.g. "1) Golden Sun") or top-level headers; each entry must include the three labels: Turn Economy, Stat Progression, Exploration Flow
 - video_inspiration.md: games use '## Game' headers and must include Early/Mid/Boss clip lines (e.g. '- Early: ...')
 - mechanic_gap_analysis.md: must contain at least 5 occurrences of the word 'gap' (case-insensitive)

Exits 0 on success, 1 on failure and prints errors.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MARKET = ROOT / 'docs' / 'market_research.md'
VIDEO = ROOT / 'docs' / 'video_inspiration.md'
GAPS = ROOT / 'docs' / 'mechanic_gap_analysis.md'


def split_market_sections(path):
    text = path.read_text(encoding='utf-8')
    lines = text.splitlines()
    sections = []
    cur_name = None
    cur_lines = []
    num_re = re.compile(r"^\s*\d+\)\s*(.+)$")
    h2_re = re.compile(r"^##\s+(.+)$")
    for ln in lines:
        m_num = num_re.match(ln)
        m_h2 = h2_re.match(ln)
        if m_num:
            if cur_name is not None:
                sections.append((cur_name, cur_lines))
            cur_name = m_num.group(1).strip()
            cur_lines = []
        elif m_h2:
            if cur_name is not None:
                sections.append((cur_name, cur_lines))
            cur_name = m_h2.group(1).strip()
            cur_lines = []
        else:
            if cur_name is not None:
                cur_lines.append(ln)
    if cur_name is not None:
        sections.append((cur_name, cur_lines))
    return sections


def check_market():
    if not MARKET.exists():
        return [f'MISSING: {MARKET}']
    problems = []
    required = ['turn economy', 'stat progression', 'exploration flow']
    skip_keywords = ['summary', 'comparative', 'additional', 'next action', 'categories']
    sections = split_market_sections(MARKET)
    if not sections:
        return [f'market_research: no identifiable game sections found in {MARKET}']
    for name, lines in sections:
        low = name.lower()
        if any(k in low for k in skip_keywords):
            continue
        text = '\n'.join(lines).lower()
        missing = [r for r in required if r not in text]
        if missing:
            problems.append(f"market_research: section '{name}' missing breakdown items: {', '.join(missing)}")
    return problems


def split_video_sections(path):
    text = path.read_text(encoding='utf-8')
    lines = text.splitlines()
    sections = []
    cur_name = None
    cur_lines = []
    h2_re = re.compile(r"^##\s+(.+)$")
    for ln in lines:
        m_h2 = h2_re.match(ln)
        if m_h2:
            if cur_name is not None:
                sections.append((cur_name, cur_lines))
            cur_name = m_h2.group(1).strip()
            cur_lines = []
        else:
            if cur_name is not None:
                cur_lines.append(ln)
    if cur_name is not None:
        sections.append((cur_name, cur_lines))
    return sections


def check_video():
    if not VIDEO.exists():
        return [f'MISSING: {VIDEO}']
    problems = []
    sections = split_video_sections(VIDEO)
    if not sections:
        return [f'video_inspiration: no game sections found in {VIDEO}']
    for name, lines in sections:
        joined = '\n'.join(lines).lower()
        has_early = re.search(r"^\s*-\s*early\s*:\s*", joined, flags=re.M)
        has_mid = re.search(r"^\s*-\s*mid\s*:\s*", joined, flags=re.M)
        has_boss = re.search(r"^\s*-\s*boss\s*:\s*", joined, flags=re.M)
        if not (has_early and has_mid and has_boss):
            missing = []
            if not has_early:
                missing.append('Early')
            if not has_mid:
                missing.append('Mid')
            if not has_boss:
                missing.append('Boss')
            problems.append(f"video_inspiration: section '{name}' missing clips: {', '.join(missing)}")
    return problems


def check_gaps():
    if not GAPS.exists():
        return [f'MISSING: {GAPS}']
    text = GAPS.read_text(encoding='utf-8')
    count = text.lower().count('gap')
    if count < 5:
        return [f"mechanic_gap_analysis: found {count} occurrences of 'gap' (need >=5)"]
    return []


def main():
    errors = []
    errors += check_market()
    errors += check_video()
    errors += check_gaps()
    if errors:
        print('VERIFICATION FAILED')
        for e in errors:
            print('- ' + e)
        sys.exit(1)
    print('VERIFICATION OK: All checks passed')
    sys.exit(0)

if __name__ == '__main__':
    main()
