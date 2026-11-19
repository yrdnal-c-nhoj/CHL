import { useEffect, useState, type CSSProperties } from 'react';
import { useSmoothClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import styles from './Clock.module.css';

export const assets: string[] = [];

interface Location {
  latitude: number;
  longitude: number;
}

const TICKS = Array.from({ length: 72 }, (_, i) => i);
const NUMBERS = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

const FALLBACK_LOCATION: Location = {
  latitude: 40,
  longitude: 0,
};

const getSolarPosition = (date: Date, latitude: number, longitude: number) => {
  const day = Math.floor(
    (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) -
      Date.UTC(date.getFullYear(), 0, 0)) /
      86400000,
  );

  const hour =
    date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600;

  const gamma = ((2 * Math.PI) / 365) * (day - 1 + (hour - 12) / 24);

  const equationOfTime =
    229.18 *
    (0.000075 +
      0.001868 * Math.cos(gamma) -
      0.032077 * Math.sin(gamma) -
      0.014615 * Math.cos(2 * gamma) -
      0.040849 * Math.sin(2 * gamma));

  const declination =
    0.006918 -
    0.399912 * Math.cos(gamma) +
    0.070257 * Math.sin(gamma) -
    0.006758 * Math.cos(2 * gamma) +
    0.000907 * Math.sin(2 * gamma) -
    0.002697 * Math.cos(3 * gamma) +
    0.00148 * Math.sin(3 * gamma);

  const solarMinutes = hour * 60 + equationOfTime + 4 * longitude;

  const hourAngle = (solarMinutes / 4 - 180) * (Math.PI / 180);
  const lat = latitude * (Math.PI / 180);

  const sinAltitude =
    Math.sin(lat) * Math.sin(declination) +
    Math.cos(lat) * Math.cos(declination) * Math.cos(hourAngle);

  const altitude = Math.asin(Math.max(-1, Math.min(1, sinAltitude)));

  const azimuth = Math.atan2(
    Math.sin(hourAngle),
    Math.cos(hourAngle) * Math.sin(lat) - Math.tan(declination) * Math.cos(lat),
  );

  return {
    altitude: altitude * (180 / Math.PI),
    azimuth: (((azimuth * (180 / Math.PI) + 180) % 360) + 360) % 360,
  };
};

const Clock_26_11_19 = () => {
  const time = useSmoothClock(50);

  const [location, setLocation] = useState<Location>(() => ({
    latitude: FALLBACK_LOCATION.latitude,
    longitude: -time.getTimezoneOffset() / 4,
  }));

  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {
        // Continue using the approximate timezone-based location.
      },
      {
        enableHighAccuracy: false,
        maximumAge: 3600000,
        timeout: 10000,
      },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const { altitude, azimuth } = getSolarPosition(
    time,
    location.latitude,
    location.longitude,
  );

  // The simulated lamp remains active when the sun is below the horizon.
  const isDay = altitude > 3;

  const lightElevation = isDay
    ? Math.max(8, altitude)
    : 22 + Math.sin((time.getHours() / 24) * Math.PI * 2) * 8;

  const lightAzimuth = azimuth;

  // Low light produces a longer shadow.
  const shadowLength = Math.min(
    1.65,
    Math.max(0.35, 0.8 / Math.tan((lightElevation * Math.PI) / 180)),
  );

  const shadowAngle = (lightAzimuth + 180) % 360;

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  const instrumentStyle = {
    '--shadow-angle': `${shadowAngle}deg`,
    '--shadow-length': shadowLength,
    '--light-angle': `${lightAzimuth}deg`,
    '--light-elevation': `${lightElevation}deg`,
  } as CSSProperties;

  return (
    <main className={styles.container}>
      <SRTime time={time} />

      {/* Ambient digital clock */}
      <div className={styles.digitalBackground} aria-hidden="true">
        <div className={styles.digitalTime}>
          {hours}
          <span className={styles.colon}>:</span>
          {minutes}
          <span className={styles.colon}>:</span>
          {seconds}
        </div>
        <div className={styles.digitalLabel}>LOCAL MEAN TIME</div>
      </div>

      {/* Wall-mounted instrument */}
      <div
        className={styles.instrument}
        style={instrumentStyle}
        aria-label="Simulated astronomical sundial"
      >
        <div className={styles.outerHousing}>
          <div className={styles.outerRim} />
          <div className={styles.innerRim} />

          {/* Degree markings */}
          <div className={styles.tickRing} aria-hidden="true">
            {TICKS.map((tick) => (
              <span
                key={tick}
                className={`${styles.tick} ${
                  tick % 6 === 0
                    ? styles.majorTick
                    : tick % 3 === 0
                      ? styles.mediumTick
                      : ''
                }`}
                style={{ '--tick-angle': `${tick * 5}deg` } as CSSProperties}
              />
            ))}
          </div>

          {/* Hour numerals */}
          <div className={styles.numbers} aria-hidden="true">
            {NUMBERS.map((number, index) => (
              <span
                key={number}
                style={
                  {
                    '--number-angle': `${index * 30}deg`,
                  } as CSSProperties
                }
              >
                {number.toString().padStart(2, '0')}
              </span>
            ))}
          </div>

          {/* Inner calibrated dial */}
          <div className={styles.dial}>
            <div className={styles.crosshair} />
            <div className={styles.compassRing} />

            <div className={styles.compassLabels}>
              <span className={styles.north}>N</span>
              <span className={styles.east}>E</span>
              <span className={styles.south}>S</span>
              <span className={styles.west}>W</span>
            </div>

            {/* Moving shadow */}
            <div className={styles.shadowAssembly}>
              <div className={styles.gnomonShadow} />
            </div>

            {/* Projecting three-dimensional gnomon */}
            <div className={styles.gnomonAssembly}>
              <div className={styles.gnomonBase} />
              <div className={styles.gnomonBody} />
              <div className={styles.gnomonHighlight} />
              <div className={styles.gnomonTip} />
              <div className={styles.gnomonMount} />
            </div>

            <div className={styles.centerPin} />
          </div>

          {/* Instrument identification */}
          <div className={styles.instrumentLabel}>
            <span>SOLAR / 01</span>
            <span>AZIMUTH INSTRUMENT</span>
          </div>

          <div className={styles.status}>
            <span className={styles.statusLight} />
            {isDay ? 'SOLAR MODE' : 'LAMP MODE'}
          </div>
        </div>

        {/* External simulated light */}
        <div className={styles.lightSource}>
          <div className={styles.lightHalo} />
          <div className={styles.lightCore} />
        </div>
      </div>

      {/* Technical readout */}
      <div className={styles.readout} aria-hidden="true">
        <div>
          <span>AZIMUTH</span>
          <strong>{azimuth.toFixed(1)}°</strong>
        </div>
        <div>
          <span>ELEVATION</span>
          <strong>{altitude.toFixed(1)}°</strong>
        </div>
        <div>
          <span>POSITION</span>
          <strong>
            {location.latitude.toFixed(1)}° / {location.longitude.toFixed(1)}°
          </strong>
        </div>
      </div>
    </main>
  );
};

Clock_26_11_19.displayName = 'Clock_26_11_19';

export default Clock_26_11_19;
