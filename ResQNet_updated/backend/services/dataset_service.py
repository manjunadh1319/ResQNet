"""
Loads and queries the CSV reference datasets (hospitals, rescue teams,
relief resources, shelters). Data is cached in memory after first read.
"""
import csv
from functools import lru_cache
from typing import List, Dict

from config.settings import settings


def _read_csv(path) -> List[Dict]:
    rows = []
    with open(path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            rows.append(row)
    return rows


@lru_cache(maxsize=1)
def get_hospitals() -> List[Dict]:
    return _read_csv(settings.HOSPITALS_CSV)


@lru_cache(maxsize=1)
def get_rescue_teams() -> List[Dict]:
    return _read_csv(settings.RESCUE_TEAMS_CSV)


@lru_cache(maxsize=1)
def get_relief_resources() -> List[Dict]:
    return _read_csv(settings.RELIEF_RESOURCES_CSV)


@lru_cache(maxsize=1)
def get_shelters() -> List[Dict]:
    return _read_csv(settings.SHELTERS_CSV)


def find_nearest_hospitals(location: str, limit: int = 3) -> List[Dict]:
    """Simple location-name matching with a fallback to highest-capacity hospitals."""
    hospitals = get_hospitals()
    location_lower = location.lower()
    matched = [h for h in hospitals if location_lower in h["location"].lower()
               or h["location"].lower() in location_lower]
    if not matched:
        matched = sorted(hospitals, key=lambda h: int(h["beds"]), reverse=True)
    return matched[:limit]


def find_available_rescue_teams(location: str, limit: int = 3) -> List[Dict]:
    teams = get_rescue_teams()
    location_lower = location.lower()
    matched = [t for t in teams if (location_lower in t["location"].lower()
               or t["location"].lower() in location_lower) and t["available"].lower() == "yes"]
    if not matched:
        matched = [t for t in teams if t["available"].lower() == "yes"]
    return matched[:limit]


def find_nearest_shelters(location: str, limit: int = 3) -> List[Dict]:
    shelters = get_shelters()
    location_lower = location.lower()
    matched = [s for s in shelters if location_lower in s["location"].lower()
               or s["location"].lower() in location_lower]
    if not matched:
        matched = sorted(shelters, key=lambda s: int(s["capacity"]), reverse=True)
    return matched[:limit]
