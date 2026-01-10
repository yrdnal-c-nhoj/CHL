import React, { useState, useEffect } from 'react';
import topoImage from '../../assets/clocks/25-12-25/topo.jpg';

// Constants
const COLORS = {
  primary: '#057CE4',
  secondary: '#8f83a2',
  textDark: '#413E57',
  textLight: '#57552F',
  white: '#fff',
  border: '#e6e6e6',
  borderDashed: '#635354',
  barcode: '#000'
};

// Top 200 most popular airports in the world
const TOP_AIRPORTS = [
  { city: 'London', code: 'LHR', lat: 51.4700, lon: -0.4543 },
  { city: 'New York', code: 'JFK', lat: 40.6413, lon: -73.7781 },
  { city: 'Tokyo', code: 'HND', lat: 35.5494, lon: 139.7798 },
  { city: 'Dubai', code: 'DXB', lat: 25.2532, lon: 55.3657 },
  { city: 'Singapore', code: 'SIN', lat: 1.3644, lon: 103.9915 },
  { city: 'Los Angeles', code: 'LAX', lat: 33.9416, lon: -118.4085 },
  { city: 'Hong Kong', code: 'HKG', lat: 22.3080, lon: 113.9185 },
  { city: 'Seoul', code: 'ICN', lat: 37.4602, lon: 126.4407 },
  { city: 'Amsterdam', code: 'AMS', lat: 52.3105, lon: 4.7683 },
  { city: 'Paris', code: 'CDG', lat: 49.0097, lon: 2.5479 },
  { city: 'Istanbul', code: 'IST', lat: 41.2753, lon: 28.7519 },
  { city: 'Chicago', code: 'ORD', lat: 41.9742, lon: -87.9073 },
  { city: 'Frankfurt', code: 'FRA', lat: 50.0379, lon: 8.5622 },
  { city: 'Bangkok', code: 'BKK', lat: 13.6900, lon: 100.7501 },
  { city: 'Beijing', code: 'PEK', lat: 40.0799, lon: 116.5975 },
  { city: 'Madrid', code: 'MAD', lat: 40.4719, lon: -3.5626 },
  { city: 'Barcelona', code: 'BCN', lat: 41.2974, lon: 2.0785 },
  { city: 'Zurich', code: 'ZRH', lat: 47.4645, lon: 8.5492 },
  { city: 'Munich', code: 'MUC', lat: 48.3534, lon: 11.7861 },
  { city: 'Sydney', code: 'SYD', lat: -33.9399, lon: 151.1753 },
  { city: 'Toronto', code: 'YYZ', lat: 43.6777, lon: -79.6248 },
  { city: 'San Francisco', code: 'SFO', lat: 37.6189, lon: -122.3750 },
  { city: 'Rome', code: 'FCO', lat: 41.8003, lon: 12.2389 },
  { city: 'Shanghai', code: 'PVG', lat: 31.1557, lon: 121.8062 },
  { city: 'Atlanta', code: 'ATL', lat: 33.6407, lon: -84.4277 },
  { city: 'Boston', code: 'BOS', lat: 42.3656, lon: -71.0096 },
  { city: 'Dallas', code: 'DFW', lat: 32.8998, lon: -97.0403 },
  { city: 'Denver', code: 'DEN', lat: 39.8561, lon: -104.6737 },
  { city: 'Las Vegas', code: 'LAS', lat: 36.0840, lon: -115.1537 },
  { city: 'Miami', code: 'MIA', lat: 25.7959, lon: -80.2870 },
  { city: 'Orlando', code: 'MCO', lat: 28.4312, lon: -81.3080 },
  { city: 'Philadelphia', code: 'PHL', lat: 39.8719, lon: -75.2411 },
  { city: 'Phoenix', code: 'PHX', lat: 33.4342, lon: -112.0116 },
  { city: 'Seattle', code: 'SEA', lat: 47.4502, lon: -122.3088 },
  { city: 'Washington DC', code: 'IAD', lat: 38.9531, lon: -77.4565 },
  { city: 'Houston', code: 'IAH', lat: 29.9844, lon: -95.3415 },
  { city: 'San Diego', code: 'SAN', lat: 32.7338, lon: -117.1898 },
  { city: 'Minneapolis', code: 'MSP', lat: 44.8848, lon: -93.2223 },
  { city: 'Detroit', code: 'DTW', lat: 42.2124, lon: -83.3534 },
  { city: 'Charlotte', code: 'CLT', lat: 35.2140, lon: -80.9431 },
  { city: 'Taipei', code: 'TPE', lat: 25.0797, lon: 121.2342 },
  { city: 'Athens', code: 'ATH', lat: 37.9364, lon: 23.9445 },
  { city: 'Vienna', code: 'VIE', lat: 48.1105, lon: 16.5697 },
  { city: 'Copenhagen', code: 'CPH', lat: 55.6180, lon: 12.6560 },
  { city: 'Stockholm', code: 'ARN', lat: 59.6519, lon: 17.9186 },
  { city: 'Oslo', code: 'OSL', lat: 60.1939, lon: 11.1004 },
  { city: 'Helsinki', code: 'HEL', lat: 60.3172, lon: 24.9633 },
  { city: 'Zagreb', code: 'ZAG', lat: 45.7426, lon: 16.0695 },
  { city: 'Lisbon', code: 'LIS', lat: 38.7742, lon: -9.1342 },
  { city: 'Brussels', code: 'BRU', lat: 50.8949, lon: 4.4828 },
  { city: 'Prague', code: 'PRG', lat: 50.1008, lon: 14.2600 },
  { city: 'Warsaw', code: 'WAW', lat: 52.1657, lon: 20.9671 },
  { city: 'Budapest', code: 'BUD', lat: 47.4344, lon: 19.2627 },
  { city: 'Rome', code: 'FCO', lat: 41.8003, lon: 12.2389 },
  { city: 'Venice', code: 'VCE', lat: 45.5053, lon: 12.3389 },
  { city: 'Milan', code: 'MXP', lat: 45.6191, lon: 8.7216 },
  { city: 'Naples', code: 'NAP', lat: 40.8858, lon: 14.2908 },
  { city: 'Palma de Mallorca', code: 'PMI', lat: 39.5516, lon: 2.7389 },
  { city: 'Malaga', code: 'AGP', lat: 36.6711, lon: -4.4991 },
  { city: 'Valencia', code: 'VLC', lat: 39.4891, lon: -0.4797 },
  { city: 'Seville', code: 'SVQ', lat: 37.4184, lon: -5.8932 },
  { city: 'Bilbao', code: 'BIO', lat: 43.3007, lon: -2.9083 },
  { city: 'Alicante', code: 'ALC', lat: 38.2780, lon: -0.5610 },
  { city: 'Gran Canaria', code: 'LPA', lat: 27.9318, lon: -15.3862 },
  { city: 'Tenerife', code: 'TFS', lat: 28.0450, lon: -16.5725 },
  { city: 'Cancun', code: 'CUN', lat: 21.0388, lon: -86.8746 },
  { city: 'Los Cabos', code: 'SJD', lat: 23.1541, lon: -109.9210 },
  { city: 'Puerto Vallarta', code: 'PVR', lat: 20.6808, lon: -105.2618 },
  { city: 'Montreal', code: 'YUL', lat: 45.4706, lon: -73.7410 },
  { city: 'Vancouver', code: 'YVR', lat: 49.1947, lon: -123.1792 },
  { city: 'Calgary', code: 'YYC', lat: 51.1214, lon: -114.0107 },
  { city: 'Edmonton', code: 'YEG', lat: 53.3097, lon: -113.5795 },
  { city: 'Ottawa', code: 'YOW', lat: 45.3225, lon: -75.6694 },
  { city: 'Halifax', code: 'YHZ', lat: 44.8774, lon: -63.5109 },
  { city: 'Victoria', code: 'YYJ', lat: 48.6468, lon: -123.4261 },
  { city: 'Winnipeg', code: 'YWG', lat: 49.9095, lon: -97.2360 },
  { city: 'Kelowna', code: 'YLW', lat: 49.9511, lon: -119.3750 },
  { city: 'Saskatoon', code: 'YXE', lat: 52.1708, lon: -106.6696 },
  { city: 'Regina', code: 'YQR', lat: 50.4378, lon: -104.6705 },
  { city: 'Thunder Bay', code: 'YQT', lat: 48.3738, lon: -89.3223 },
  { city: 'London', code: 'LGW', lat: 51.1487, lon: -0.1905 },
  { city: 'Manchester', code: 'MAN', lat: 53.3538, lon: -2.2751 },
  { city: 'Birmingham', code: 'BHX', lat: 52.4533, lon: -1.7477 },
  { city: 'Edinburgh', code: 'EDI', lat: 55.9513, lon: -3.3624 },
  { city: 'Glasgow', code: 'GLA', lat: 55.8720, lon: -4.4319 },
  { city: 'Bristol', code: 'BRS', lat: 51.3809, lon: -2.7216 },
  { city: 'Liverpool', code: 'LPL', lat: 53.3336, lon: -2.8497 },
  { city: 'Leeds', code: 'LBA', lat: 53.8658, lon: -1.6606 },
  { city: 'Newcastle', code: 'NCL', lat: 55.0375, lon: -1.6917 },
  { city: 'Dublin', code: 'DUB', lat: 53.4213, lon: -6.2701 },
  { city: 'Cork', code: 'ORK', lat: 51.8413, lon: -8.4911 },
  { city: 'Shannon', code: 'SNN', lat: 52.7097, lon: -8.9242 },
  { city: 'Kerry', code: 'KIR', lat: 52.1600, lon: -9.3967 },
  { city: 'Waterford', code: 'WAT', lat: 52.2614, lon: -7.1093 },
  { city: 'Paris', code: 'ORY', lat: 48.7233, lon: 2.3792 },
  { city: 'Nice', code: 'NCE', lat: 43.6584, lon: 7.2159 },
  { city: 'Marseille', code: 'MRS', lat: 43.4388, lon: 5.2212 },
  { city: 'Lyon', code: 'LYS', lat: 45.7252, lon: 5.0813 },
  { city: 'Toulouse', code: 'TLS', lat: 43.6291, lon: 1.3644 },
  { city: 'Bordeaux', code: 'BOD', lat: 44.8283, lon: -0.7143 },
  { city: 'Strasbourg', code: 'SXB', lat: 48.5767, lon: 7.6345 },
  { city: 'Nantes', code: 'NTE', lat: 47.1531, lon: -1.6104 },
  { city: 'Lille', code: 'LIL', lat: 50.5644, lon: 3.0797 },
  { city: 'Geneva', code: 'GVA', lat: 46.2379, lon: 6.1093 },
  { city: 'Basel', code: 'BSL', lat: 47.5912, lon: 7.5187 },
  { city: 'Bern', code: 'BRN', lat: 46.9000, lon: 7.4870 },
  { city: 'Lucerne', code: 'LCE', lat: 47.0589, lon: 8.3058 },
  { city: 'St. Gallen', code: 'ACH', lat: 47.4645, lon: 9.3800 },
  { city: 'Innsbruck', code: 'INN', lat: 47.2624, lon: 11.3429 },
  { city: 'Salzburg', code: 'SZG', lat: 47.7927, lon: 13.0060 },
  { city: 'Graz', code: 'GRZ', lat: 47.0709, lon: 15.4395 },
  { city: 'Linz', code: 'LNZ', lat: 48.2466, lon: 14.1847 },
  { city: 'Klagenfurt', code: 'KLU', lat: 46.6225, lon: 14.3347 },
  { city: 'Dusseldorf', code: 'DUS', lat: 51.2895, lon: 6.7668 },
  { city: 'Hamburg', code: 'HAM', lat: 53.6304, lon: 10.0256 },
  { city: 'Cologne', code: 'CGN', lat: 50.8659, lon: 7.1428 },
  { city: 'Stuttgart', code: 'STR', lat: 48.6899, lon: 9.2219 },
  { city: 'Leipzig', code: 'LEJ', lat: 51.4237, lon: 12.2364 },
  { city: 'Dresden', code: 'DRS', lat: 51.1289, lon: 13.7668 },
  { city: 'Nuremberg', code: 'NUE', lat: 49.4988, lon: 11.0781 },
  { city: 'Hannover', code: 'HAJ', lat: 52.4617, lon: 9.6801 },
  { city: 'Bremen', code: 'BRE', lat: 53.0476, lon: 8.7862 },
  { city: 'Munster', code: 'FMO', lat: 51.9583, lon: 7.6775 },
  { city: 'Karlsruhe', code: 'FKB', lat: 48.7797, lon: 8.0990 },
  { city: 'Saarbrucken', code: 'SCN', lat: 49.2325, lon: 7.1134 },
  { city: 'Rostock', code: 'RLG', lat: 54.0899, lon: 12.0870 },
  { city: 'Erfurt', code: 'ERF', lat: 50.9801, lon: 11.0333 },
  { city: 'Bologna', code: 'BLQ', lat: 44.5391, lon: 11.2790 },
  { city: 'Florence', code: 'FLR', lat: 43.7848, lon: 11.2580 },
  { city: 'Pisa', code: 'PSA', lat: 43.7128, lon: 10.3966 },
  { city: 'Turin', code: 'TRN', lat: 45.2008, lon: 7.6496 },
  { city: 'Genoa', code: 'GOA', lat: 44.4139, lon: 8.8516 },
  { city: 'Bari', code: 'BRI', lat: 41.1400, lon: 16.7644 },
  { city: 'Brindisi', code: 'BDS', lat: 40.6419, lon: 17.9214 },
  { city: 'Catania', code: 'CTA', lat: 37.4669, lon: 15.0664 },
  { city: 'Palermo', code: 'PMO', lat: 38.1772, lon: 13.0902 },
  { city: 'Lamezia Terme', code: 'SUF', lat: 38.9339, lon: 16.2414 },
  { city: 'Cagliari', code: 'CAG', lat: 39.2438, lon: 9.0759 },
  { city: 'Olbia', code: 'OLB', lat: 40.9211, lon: 9.4991 },
  { city: 'Trapani', code: 'TPS', lat: 38.0229, lon: 12.5175 },
  { city: 'Comiso', code: 'CIY', lat: 36.8692, lon: 14.5803 },
  { city: 'Porto', code: 'OPO', lat: 41.2429, lon: -8.6782 },
  { city: 'Faro', code: 'FAO', lat: 37.0183, lon: -7.9319 },
  { city: 'Madeira', code: 'FNC', lat: 32.7062, lon: -16.7771 },
  { city: 'Ponta Delgada', code: 'PDL', lat: 37.7433, lon: -25.6797 },
  { city: 'Charleroi', code: 'CRL', lat: 50.4614, lon: 4.4510 },
  { city: 'Antwerp', code: 'ANR', lat: 51.1853, lon: 4.4639 },
  { city: 'Liege', code: 'LGG', lat: 50.6370, lon: 5.4437 },
  { city: 'Namur', code: 'QNU', lat: 50.4578, lon: 4.8720 },
  { city: 'Bruges', code: 'BZY', lat: 51.1975, lon: 3.2256 },
  { city: 'Ghent', code: 'GNE', lat: 51.0381, lon: 3.7280 },
  { city: 'Kortrijk', code: 'KJK', lat: 50.8278, lon: 3.2644 },
  { city: 'Ostend', code: 'OST', lat: 51.1992, lon: 2.8483 },
  { city: 'Leuven', code: 'LVO', lat: 50.8798, lon: 4.7008 },
  { city: 'Rotterdam', code: 'RTM', lat: 51.9589, lon: 4.4429 },
  { city: 'Eindhoven', code: 'EIN', lat: 51.4494, lon: 5.3750 },
  { city: 'Maastricht', code: 'MST', lat: 50.9113, lon: 5.7614 },
  { city: 'Groningen', code: 'GRQ', lat: 53.2194, lon: 6.5665 },
  { city: 'The Hague', code: 'HAG', lat: 52.0705, lon: 4.3007 },
  { city: 'Utrecht', code: 'UTC', lat: 52.1806, lon: 5.1767 },
  { city: 'Arnhem', code: 'ARN', lat: 51.9828, lon: 5.8987 },
  { city: 'Leeuwarden', code: 'LWR', lat: 53.2194, lon: 5.7950 },
  { city: 'Enschede', code: 'ENS', lat: 52.2217, lon: 6.8914 },
  { city: 'Breda', code: 'BQH', lat: 51.5842, lon: 4.7644 },
  { city: 'Tilburg', code: 'TIL', lat: 51.5606, lon: 5.0911 },
  { city: 'Haarlem', code: 'HAR', lat: 52.3872, lon: 4.6462 },
  { city: 'Aarhus', code: 'AAR', lat: 56.2912, lon: 10.0917 },
  { city: 'Odense', code: 'ODE', lat: 55.4038, lon: 10.3833 },
  { city: 'Aalborg', code: 'AAL', lat: 57.0928, lon: 9.8492 },
  { city: 'Esbjerg', code: 'EBJ', lat: 55.5417, lon: 8.5922 },
  { city: 'Billund', code: 'BLL', lat: 55.7397, lon: 9.1606 },
  { city: 'Roskilde', code: 'RKE', lat: 55.6200, lon: 12.0847 },
  { city: 'Herning', code: 'HNN', lat: 56.1497, lon: 9.0236 },
  { city: 'Vejle', code: 'VEJ', lat: 55.7169, lon: 9.5025 },
  { city: 'Kolding', code: 'KLD', lat: 55.4939, lon: 9.4489 },
  { city: 'Horsens', code: 'HOJ', lat: 55.9839, lon: 9.8492 },
  { city: 'Randers', code: 'RNN', lat: 56.4611, lon: 10.0403 },
  { city: 'Skive', code: 'SQW', lat: 56.5900, lon: 9.1606 },
  { city: 'Hobro', code: 'HOB', lat: 56.7667, lon: 9.8492 },
  { city: 'Thisted', code: 'TED', lat: 56.7667, lon: 8.5922 },
  { city: 'Gothenburg', code: 'GOT', lat: 57.6629, lon: 11.9689 },
  { city: 'Malmö', code: 'MMX', lat: 55.5394, lon: 13.3919 },
  { city: 'Uppsala', code: 'UAS', lat: 59.8586, lon: 17.6389 },
  { city: 'Västerås', code: 'VST', lat: 59.3586, lon: 16.6111 },
  { city: 'Örebro', code: 'ORB', lat: 59.2603, lon: 15.0436 },
  { city: 'Linköping', code: 'LPI', lat: 58.4108, lon: 15.6142 },
  { city: 'Helsingborg', code: 'HEO', lat: 56.0436, lon: 12.6714 },
  { city: 'Norrköping', code: 'NRK', lat: 58.5833, lon: 16.1833 },
  { city: 'Umeå', code: 'UME', lat: 63.8256, lon: 20.2672 },
  { city: 'Lund', code: 'LUG', lat: 55.7169, lon: 13.1900 },
  { city: 'Växjö', code: 'VXO', lat: 56.8781, lon: 14.8058 },
  { city: 'Karlstad', code: 'KSD', lat: 59.3789, lon: 13.5014 },
  { city: 'Skövde', code: 'KVB', lat: 58.3922, lon: 13.8469 },
  { city: 'Falun', code: 'FLL', lat: 60.6064, lon: 15.6378 },
  { city: 'Gävle', code: 'GVX', lat: 60.6761, lon: 17.1417 },
  { city: 'Karlskrona', code: 'KRN', lat: 56.1608, lon: 15.5781 },
  { city: 'Halmstad', code: 'HAD', lat: 56.6744, lon: 12.8564 },
  { city: 'Kristianstad', code: 'KID', lat: 56.0292, lon: 14.1567 },
  { city: 'Bergen', code: 'BGO', lat: 60.2939, lon: 5.2185 },
  { city: 'Trondheim', code: 'TRD', lat: 63.4679, lon: 10.9158 },
  { city: 'Stavanger', code: 'SVG', lat: 58.8745, lon: 5.6409 },
  { city: 'Kristiansand', code: 'KRS', lat: 58.1597, lon: 7.9956 },
  { city: 'Tromsø', code: 'TOS', lat: 69.6811, lon: 18.9150 },
  { city: 'Ålesund', code: 'AES', lat: 62.5620, lon: 6.1289 },
  { city: 'Bodø', code: 'BOO', lat: 67.2803, lon: 14.3989 },
  { city: 'Molde', code: 'MOL', lat: 62.7344, lon: 7.2750 },
  { city: 'Haugesund', code: 'HAU', lat: 59.4322, lon: 5.2500 },
  { city: 'Sandefjord', code: 'TRF', lat: 59.1689, lon: 10.2250 },
  { city: 'Skien', code: 'SKE', lat: 59.2089, lon: 9.6089 },
  { city: 'Fredrikstad', code: 'FRED', lat: 59.2228, lon: 10.9500 },
  { city: 'Drammen', code: 'DRA', lat: 59.7444, lon: 10.2039 },
  { city: 'Larvik', code: 'LAR', lat: 59.0689, lon: 10.0500 },
  { city: 'Turku', code: 'TKU', lat: 60.5189, lon: 22.2647 },
  { city: 'Tampere', code: 'TMP', lat: 61.3869, lon: 23.5289 },
  { city: 'Oulu', code: 'OUL', lat: 64.9319, lon: 25.3639 },
  { city: 'Vaasa', code: 'VAA', lat: 63.0700, lon: 21.7500 },
  { city: 'Kuopio', code: 'KUO', lat: 62.8925, lon: 27.7022 },
  { city: 'Jyväskylä', code: 'JYV', lat: 62.4019, lon: 25.6700 },
  { city: 'Pori', code: 'POR', lat: 61.4750, lon: 21.7989 },
  { city: 'Lahti', code: 'LHT', lat: 60.9800, lon: 25.6625 },
  { city: 'Kuusamo', code: 'KAO', lat: 65.9839, lon: 29.2319 },
  { city: 'Rovaniemi', code: 'RVN', lat: 66.5641, lon: 25.8301 },
  { city: 'Ivalo', code: 'IVL', lat: 68.6408, lon: 27.5419 },
  { city: 'Joensuu', code: 'JOE', lat: 62.6039, lon: 29.7689 },
  { city: 'Mikkeli', code: 'MIK', lat: 61.6900, lon: 27.2667 },
  { city: 'Savonlinna', code: 'SVL', lat: 61.9333, lon: 28.9500 },
  { city: 'Kajaani', code: 'KAJ', lat: 64.2297, lon: 27.7247 },
  { city: 'Lappeenranta', code: 'LPP', lat: 61.0400, lon: 28.1889 },
  { city: 'Split', code: 'SPU', lat: 43.5467, lon: 16.2611 },
  { city: 'Dubrovnik', code: 'DBV', lat: 42.8917, lon: 18.2644 },
  { city: 'Rijeka', code: 'RJK', lat: 45.2172, lon: 14.5808 },
  { city: 'Osijek', code: 'OSI', lat: 45.5500, lon: 18.7000 },
  { city: 'Zadar', code: 'ZAD', lat: 44.1189, lon: 15.3589 },
  { city: 'Pula', code: 'PUY', lat: 44.8667, lon: 13.8500 },
  { city: 'Šibenik', code: 'SJJ', lat: 43.7333, lon: 15.9000 },
  { city: 'Varaždin', code: 'VAR', lat: 46.3000, lon: 16.3500 },
  { city: 'Slavonski Brod', code: 'SLO', lat: 45.6667, lon: 18.0167 },
  { city: 'Gospić', code: 'GOS', lat: 44.4500, lon: 15.0667 },
  { city: 'Karlovac', code: 'KLV', lat: 45.4833, lon: 15.5500 },
  { city: 'Virovitica', code: 'VIV', lat: 45.8333, lon: 17.3833 },
  { city: 'Bjelovar', code: 'BJE', lat: 45.7500, lon: 16.8333 },
  { city: 'Sisak', code: 'SIK', lat: 45.5000, lon: 16.3500 },
  { city: 'Split', code: 'SPU', lat: 43.5467, lon: 16.2611 },
  { city: 'Dubrovnik', code: 'DBV', lat: 42.8917, lon: 18.2644 },
  { city: 'Rijeka', code: 'RJK', lat: 45.2172, lon: 14.5808 },
  { city: 'Osijek', code: 'OSI', lat: 45.5500, lon: 18.7000 },
  { city: 'Zadar', code: 'ZAD', lat: 44.1189, lon: 15.3589 },
  { city: 'Pula', code: 'PUY', lat: 44.8667, lon: 13.8500 },
  { city: 'Šibenik', code: 'SJJ', lat: 43.7333, lon: 15.9000 },
  { city: 'Varaždin', code: 'VAR', lat: 46.3000, lon: 16.3500 },
  { city: 'Slavonski Brod', code: 'SLO', lat: 45.6667, lon: 18.0167 },
  { city: 'Gospić', code: 'GOS', lat: 44.4500, lon: 15.0667 },
  { city: 'Karlovac', code: 'KLV', lat: 45.4833, lon: 15.5500 },
  { city: 'Virovitica', code: 'VIV', lat: 45.8333, lon: 17.3833 },
  { city: 'Bjelovar', code: 'BJE', lat: 45.7500, lon: 16.8333 },
  { city: 'Sisak', code: 'SIK', lat: 45.5000, lon: 16.3500 }
];

// Calculate flight duration using haversine formula
const calculateFlightDuration = (origin, destination) => {
  const R = 6371; // Earth's radius in km
  const toRad = (deg) => deg * (Math.PI / 180);
  
  const dLat = toRad(destination.lat - origin.lat);
  const dLon = toRad(destination.lon - origin.lon);
  const lat1 = toRad(origin.lat);
  const lat2 = toRad(destination.lat);
  
  const a = Math.sin(dLat/2)**2 + Math.sin(dLon/2)**2 * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  // Average commercial flight speed ~ 900 km/h
  const speed = 900;
  const hours = distance / speed;
  return Math.round(hours * 60); // return in minutes
};

// Function to get random airports
const getRandomAirports = () => {
  const randomIndex1 = Math.floor(Math.random() * TOP_AIRPORTS.length);
  let randomIndex2 = Math.floor(Math.random() * TOP_AIRPORTS.length);
  
  // Ensure we don't get the same airport for origin and destination
  while (randomIndex2 === randomIndex1) {
    randomIndex2 = Math.floor(Math.random() * TOP_AIRPORTS.length);
  }
  
  return {
    origin: TOP_AIRPORTS[randomIndex1],
    destination: TOP_AIRPORTS[randomIndex2]
  };
};

const BoardingPass = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [fontLoaded, setFontLoaded] = useState(false);
  const [flightData, setFlightData] = useState(() => {
    const randomAirports = getRandomAirports();
    return {
      airline: 'BorrowedTime',
      flightNumber: 'DY 289',
      passenger: 'Cubist Heart',
      seat: '13d',
      terminal: '3',
      gate: '59',
      origin: randomAirports.origin,
      destination: randomAirports.destination,
      flightDuration: calculateFlightDuration(randomAirports.origin, randomAirports.destination),
      boardingTime: -20 // minutes before departure
    };
  });

  // Update flight data every second
  useEffect(() => {
    const updateFlightData = () => {
      const randomAirports = getRandomAirports();
      setFlightData(prev => ({
        ...prev,
        origin: randomAirports.origin,
        destination: randomAirports.destination,
        flightDuration: calculateFlightDuration(randomAirports.origin, randomAirports.destination)
      }));
    };

    // Initial update
    updateFlightData();
    
    // Update current time every second
    const timeTimer = setInterval(() => setCurrentDate(new Date()), 1000);
    
    // Update flight data every 3 seconds (less jarring than every second)
    const flightTimer = setInterval(updateFlightData, 3000);
    
    // Load font
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Oxanium:wght@600;700&family=Roboto:wght@400;500;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    const fontTimer = setTimeout(() => setFontLoaded(true), 1000);

    // Cleanup
    return () => {
      clearInterval(flightTimer);
      clearInterval(timeTimer);
      clearTimeout(fontTimer);
      if (link.parentNode) link.parentNode.removeChild(link);
    };
  }, []);

  // Utility functions
  const addMinutes = (date, minutes) => {
    const result = new Date(date);
    result.setMinutes(result.getMinutes() + minutes);
    return result;
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).toUpperCase();
  };

  const arrivalTime = addMinutes(currentDate, flightData.flightDuration);
  const boardingTime = addMinutes(currentDate, flightData.boardingTime);

  return (
    <div style={styles.container}>
      <div style={styles.ticket}>
        <div style={styles.header}>
          <div style={styles.logo(fontLoaded)}>{flightData.airline}</div>
          <div style={styles.flightLabel}>Boarding Pass</div>
        </div>

        <div style={styles.body}>
          <div style={styles.notch('left')}></div>
          <div style={styles.notch('right')}></div>

          <div style={styles.locations}>
            <LocationDisplay 
              city={flightData.origin.city}
              code={flightData.origin.code}
              time={formatTime(currentDate)}
            />
            <Arrow />
            <LocationDisplay 
              city={flightData.destination.city}
              code={flightData.destination.code}
              time={formatTime(arrivalTime)}
            />
          </div>

          <div style={styles.bodyInfo}>
            <div style={styles.info}>
              <InfoField label="Passenger" value={flightData.passenger} />
              <InfoField label="Seat" value={flightData.seat} style={styles.infoSeat} />
            </div>

            <div style={styles.flightInfo}>
              <InfoField label="Flight" value={flightData.flightNumber} />
              <InfoField label="Date" value={formatDate(currentDate)} />
              <InfoField label="Depart" value={formatTime(currentDate)} />
            </div>
          </div>
        </div>

        <div style={styles.bottom}>
          <div style={styles.bottomInfo}>
            <div style={styles.depart}>
              <InfoField label="Terminal" value={flightData.terminal} />
              <InfoField label="Gate" value={flightData.gate} />
              <InfoField label="Boarding" value={formatTime(boardingTime)} />
            </div>

            <div style={styles.barcode}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Utility functions
const formatDate = (date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
const formatTime = (date) => date.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit' });
const addMinutes = (date, minutes) => new Date(date.getTime() + minutes * 60000);

// Generate topographic SVG background with random wavy curves
const generateTopographicSVG = () => {
  const lines = 12; // number of contour lines
  const width = 600;
  const height = 600;
  const colors = ['#503c6f', '#4a3570', '#3f2d5e', '#36264f']; // multiple colors for elevation
  let svgContent = `<svg width='${width}' height='${height}' xmlns='http://www.w3.org/2000/svg'>`;

  for (let i = 0; i < lines; i++) {
    const yBase = (height / lines) * i;
    const color = colors[i % colors.length];
    const opacity = 0.15 + Math.random() * 0.15; // semi-transparent
    const pathPoints = [];

    for (let x = 0; x <= width; x += 20) {
      const yOffset = Math.sin((x / width) * Math.PI * 2 + Math.random()) * 10 * Math.random();
      pathPoints.push(`${x},${yBase + yOffset}`);
    }

    svgContent += `<path d='M${pathPoints.join(' L')}' fill='none' stroke='${color}' stroke-width='1.2' opacity='${opacity}'/>`;
  }

  svgContent += `</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svgContent)}")`;
};

// Styles
const styles = {
  container: {
    width: '100vw',
    height: '100dvh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Roboto, Arial, sans-serif',
    fontSize: '0.625rem',
    margin: 0,
    padding: 0,
    backgroundColor: COLORS.secondary,
    backgroundImage: `url(${topoImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  },
  ticket: {
    width: '90vw',
    maxWidth: '21.25rem',
    color: COLORS.textLight,
    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
    borderRadius: '0.625rem',
    overflow: 'hidden'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.15rem 2.1875rem',
    color: COLORS.white,
    backgroundColor: COLORS.primary
  },
  logo: (fontLoaded) => ({
    fontSize: '1.80rem',
    fontWeight: '400',
    fontStyle: 'italic',
    fontFamily: fontLoaded ? 'Oxanium, sans-serif' : 'sans-serif'
  }),
  flightLabel: {
    fontSize: '0.6875rem',
    textAlign: 'right',
    textTransform: 'uppercase'
  },
  body: {
    position: 'relative',
    borderBottom: `0.0625rem dashed ${COLORS.borderDashed}`,
    backgroundColor: COLORS.white
  },
  notch: (side) => ({
    content: '""',
    position: 'absolute',
    bottom: '-0.5rem',
    width: '1rem',
    height: '1rem',
    borderRadius: '50%',
    backgroundColor: COLORS.secondary,
    ...(side === 'left' ? { left: '-0.5rem' } : { right: '-0.5rem' })
  }),
  locations: {
    display: 'flex',
    alignItems: 'center',
    padding: '1.25rem 2.1875rem',
    borderBottom: `0.0625rem solid ${COLORS.border}`
  },
  location: {
    flexGrow: 1,
    flexShrink: 0,
    textTransform: 'uppercase',
    textAlign: 'center'
  },
  cityCode: {
    margin: '0.3125rem 0',
    fontSize: '1.625rem',
    color: COLORS.textDark
  },
  arrow: {
    container: {
      position: 'relative',
      display: 'inline-block',
      width: '1.25rem',
      height: '0.125rem',
      backgroundColor: COLORS.primary
    },
    part: (rotation, origin) => ({
      content: '""',
      position: 'absolute',
      width: '0.9375rem',
      height: '0.125rem',
      backgroundColor: COLORS.primary,
      transform: `rotate(${rotation}deg)`,
      transformOrigin: origin
    })
  },
  bodyInfo: {
    padding: '1.25rem 2.1875rem'
  },
  info: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1.875rem',
    justifyContent: 'space-between',
    textTransform: 'uppercase'
  },
  infoSeat: {
    textAlign: 'right'
  },
  h2: {
    margin: '0.1875rem 0 0',
    fontSize: '1rem',
    fontWeight: 'normal',
    color: COLORS.textDark,
    textTransform: 'none'
  },
  flightInfo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    textTransform: 'uppercase'
  },
  bottom: {
    borderRadius: '0 0 0.625rem 0.625rem',
    backgroundColor: COLORS.white
  },
  bottomInfo: {
    padding: '1.25rem 2.1875rem'
  },
  depart: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '1.25rem',
    textTransform: 'uppercase'
  },
  barcode: {
    width: '100%',
    height: '2.8125rem',
    background: `linear-gradient(to right, 
      #000 0%, #000 2%, #fff 2%, #fff 3%,
      #000 3%, #000 4%, #fff 4%, #fff 6%,
      #000 6%, #000 9%, #fff 9%, #fff 10%,
      #000 10%, #000 11%, #fff 11%, #fff 12%,
      #000 12%, #000 13%, #fff 13%, #fff 16%,
      #000 16%, #000 18%, #fff 18%, #fff 19%,
      #000 19%, #000 20%, #fff 20%, #fff 21%,
      #000 21%, #000 25%, #fff 25%, #fff 26%,
      #000 26%, #000 27%, #fff 27%, #fff 29%,
      #000 29%, #000 30%, #fff 30%, #fff 33%,
      #000 33%, #000 36%, #fff 36%, #fff 37%,
      #000 37%, #000 38%, #fff 38%, #fff 40%,
      #000 40%, #000 43%, #fff 43%, #fff 44%,
      #000 44%, #000 45%, #fff 45%, #fff 46%,
      #000 46%, #000 47%, #fff 47%, #fff 50%,
      #000 50%, #000 52%, #fff 52%, #fff 53%,
      #000 53%, #000 56%, #fff 56%, #fff 57%,
      #000 57%, #000 58%, #fff 58%, #fff 59%,
      #000 59%, #000 62%, #fff 62%, #fff 64%,
      #000 64%, #000 65%, #fff 65%, #fff 67%,
      #000 67%, #000 68%, #fff 68%, #fff 69%,
      #000 69%, #000 70%, #fff 70%, #fff 73%,
      #000 73%, #000 76%, #fff 76%, #fff 77%,
      #000 77%, #000 78%, #fff 78%, #fff 81%,
      #000 81%, #000 83%, #fff 83%, #fff 84%,
      #000 84%, #000 87%, #fff 87%, #fff 88%,
      #000 88%, #000 89%, #fff 89%, #fff 90%,
      #000 90%, #000 93%, #fff 93%, #fff 96%,
      #000 96%, #000 98%, #fff 98%, #fff 100%)`
  }
};

// Sub-components
const InfoField = ({ label, value, style }) => (
  <div style={style}>
    {label}
    <h2 style={styles.h2}>{value}</h2>
  </div>
);

const LocationDisplay = ({ city, code, time }) => (
  <div style={styles.location}>
    {city}
    <h1 style={styles.cityCode}>{code}</h1>
    {time}
  </div>
);

const Arrow = () => (
  <div style={styles.location}>
    <div style={styles.arrow.container}>
      <div style={styles.arrow.part(45, '0.75rem -0.3125rem')}></div>
      <div style={styles.arrow.part(-45, '0.75rem 0.4375rem')}></div>
    </div>
  </div>
);

// Main component
const BoardingPass = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Oxanium:wght@600;700&family=Roboto:wght@400;500;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    const fontTimer = setTimeout(() => setFontLoaded(true), 1000);
    const timeTimer = setInterval(() => setCurrentDate(new Date()), 1000);

    return () => {
      clearTimeout(fontTimer);
      clearInterval(timeTimer);
      if (link.parentNode) link.parentNode.removeChild(link);
    };
  }, []);

  const arrivalTime = addMinutes(currentDate, FLIGHT_DATA.flightDuration);
  const boardingTime = addMinutes(currentDate, FLIGHT_DATA.boardingTime);

  return (
    <div style={styles.container}>
      <div style={styles.ticket}>
        <div style={styles.header}>
          <div style={styles.logo(fontLoaded)}>{FLIGHT_DATA.airline}</div>
          <div style={styles.flightLabel}>Boarding Pass</div>
        </div>

        <div style={styles.body}>
          <div style={styles.notch('left')}></div>
          <div style={styles.notch('right')}></div>

          <div style={styles.locations}>
            <LocationDisplay 
              city={FLIGHT_DATA.origin.city}
              code={FLIGHT_DATA.origin.code}
              time={formatTime(currentDate)}
            />
            <Arrow />
            <LocationDisplay 
              city={FLIGHT_DATA.destination.city}
              code={FLIGHT_DATA.destination.code}
              time={formatTime(arrivalTime)}
            />
          </div>

          <div style={styles.bodyInfo}>
            <div style={styles.info}>
              <InfoField label="Passenger" value={FLIGHT_DATA.passenger} />
              <InfoField label="Seat" value={FLIGHT_DATA.seat} style={styles.infoSeat} />
            </div>

            <div style={styles.flightInfo}>
              <InfoField label="Flight" value={FLIGHT_DATA.flightNumber} />
              <InfoField label="Date" value={formatDate(currentDate)} />
              <InfoField label="Depart" value={formatTime(currentDate)} />
            </div>
          </div>
        </div>

        <div style={styles.bottom}>
          <div style={styles.bottomInfo}>
            <div style={styles.depart}>
              <InfoField label="Terminal" value={FLIGHT_DATA.terminal} />
              <InfoField label="Gate" value={FLIGHT_DATA.gate} />
              <InfoField label="Boarding" value={formatTime(boardingTime)} />
            </div>

            <div style={styles.barcode}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardingPass;
