import requests

class ErgastService:
    # Ergast API has been discontinued. Using Jolpica API which is the new replacement
    BASE_URL = "https://api.jolpi.ca/ergast/f1"


    def get_driver_standings(self, year: int):
        """
        Fetches the driver standings for a given year.
        Returns a list of dictionaries with driver standing data.
        """
        try:
            url = f"{self.BASE_URL}/{year}/driverStandings.json"
            headers = {'User-Agent': 'F1IntelligenceSystem/1.0'}
            response = requests.get(url, headers=headers)
            if response.status_code != 200:
                print(f"Ergast API Error: {response.status_code}")
                return []
            
            data = response.json()
            # Navigate the JSON structure
            # MRData -> StandingsTable -> StandingsLists -> [0] -> DriverStandings
            standings_table = data.get("MRData", {}).get("StandingsTable", {})
            standings_lists = standings_table.get("StandingsLists", [])
            
            if not standings_lists:
                return []
            
            driver_standings = standings_lists[0].get("DriverStandings", [])
            
            # Map/Clean the data if necessary, or return as is.
            # Usually front-end expects certain keys.
            # Let's verify what keys are typically used.
            # Returning the raw list of standings is usually safe if specific transformation isn't required.
            return driver_standings

        except Exception as e:
            print(f"Error fetching driver standings: {e}")
            return []

    def get_constructor_standings(self, year: int):
        """
        Fetches the constructor standings for a given year.
        """
        try:
            url = f"{self.BASE_URL}/{year}/constructorStandings.json"
            headers = {'User-Agent': 'F1IntelligenceSystem/1.0'}
            response = requests.get(url, headers=headers)
            if response.status_code != 200:
                print(f"Ergast API Error: {response.status_code}")
                return []
            
            data = response.json()
            standings_table = data.get("MRData", {}).get("StandingsTable", {})
            standings_lists = standings_table.get("StandingsLists", [])
            
            if not standings_lists:
                return []
            
            constructor_standings = standings_lists[0].get("ConstructorStandings", [])
            return constructor_standings

        except Exception as e:
            print(f"Error fetching constructor standings: {e}")
            return []
