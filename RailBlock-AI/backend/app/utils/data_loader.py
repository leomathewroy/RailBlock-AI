import json
import os
import glob
from typing import List, Dict, Any

class DataLoader:
    def __init__(self, base_path: str = "data/raw/indian_railways"):
        self.base_path = base_path

    def load_json_file(self, filename: str) -> List[Dict[str, Any]]:
        """Loads a single JSON file."""
        filepath = os.path.join(self.base_path, filename)
        if not os.path.exists(filepath):
            print(f"File not found: {filepath}")
            return []
            
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                data = json.load(f)
                # Handle both list of dicts and dict with a list inside
                if isinstance(data, list):
                    return data
                elif isinstance(data, dict):
                    # Try to find a list value
                    for key, value in data.items():
                        if isinstance(value, list):
                            return value
                    return [data]
                else:
                    return []
        except Exception as e:
            print(f"Error loading {filepath}: {e}")
            return []

    def load_all_datasets(self) -> Dict[str, List[Dict[str, Any]]]:
        """Loads all JSON files in the base directory."""
        datasets = {}
        search_pattern = os.path.join(self.base_path, "*.json")
        
        for filepath in glob.glob(search_pattern):
            filename = os.path.basename(filepath)
            key = os.path.splitext(filename)[0]
            datasets[key] = self.load_json_file(filename)
            
        return datasets
        
    def load_trains(self) -> List[Dict[str, Any]]:
        return self.load_json_file("trains.json")
        
    def load_stations(self) -> List[Dict[str, Any]]:
        return self.load_json_file("stations.json")
        
    def load_schedules(self) -> List[Dict[str, Any]]:
        return self.load_json_file("schedules.json")
