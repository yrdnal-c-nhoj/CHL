import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useMillisecondClock } from '@/utils/hooks';
import React, { useMemo } from 'react';

import dripFont from '@/assets/fonts/26fonts/26-05-13.otf?url';
import bgVideo from '@/assets/images/26_images/26-05/26-05-13/26-05-13-yves.mp4?url';
import analogBgImage from '@/assets/images/26_images/26-05/26-05-13/klein.webp';

export const assets = [dripFont, analogBgImage, bgVideo];

const AnalogClock: React.FC = () => {
  const now = useMillisecondClock();

  if (!now) return null;

  const fontConfigs = useMemo(
    () => [
      {
        fontFamily: 'BorrowedAnalog',
        fontUrl: dripFont,
        options: {
          weight: 'normal',
          style: 'normal',
        },
      },
    ],
    [],
  );

  useSuspenseFontLoader(fontConfigs);

  // --- Start Debugging Aids ---
  // If you see a bright pink box with text, the AnalogClock component is rendering.
  // This means the issue is with the internal elements (video, image, digital time) or their CSS.
  // If you do NOT see this pink box, the component itself is not being mounted or is suspended indefinitely.
  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'deeppink',
        color: 'white',
        padding: '20px',
        zIndex: 10000,
        fontSize: '24px',
        textAlign: 'center',
        border: '5px solid yellow',
      }}
    >
      DEBUG: AnalogClock Component is Rendering!
      <br />
      Time: {now.toLocaleTimeString()}
    </div>
  );
  // --- End Debugging Aids ---

  // --- Original rendering logic (kept for reference; not compiled) ---
  //
  // return (
  //   <div className={styles.container}>
  //     {/* Video Layer (behind background image) */}
  //     <video
  //       className={styles.videoLayer}
  //       src={bgVideo}
  //       autoPlay
  //       muted
  //       loop
  //       playsInline
  //     />
  //     {/* Background Layer */}
  //     <div
  //       className={styles.backgroundLayer}
  //       style={{
  //         backgroundImage: `url(${analogBgImage})`,
  //       }}
  //     />
  //     {/* Digital Time Layer */}
  //     <div className={styles.face}>
  //       <div
  //         className={styles.digitalTime}
  //         aria-label={`Current time ${timeText}`}
  //       >
  //         {/* fixed stable layout: HH : MM : SS */}
  //         <span className={styles.digitGroup} aria-hidden="true">
  //           <span className={styles.digitBox}>{hours[0]}</span>
  //           <span className={styles.digitBox}>{hours[1]}</span>
  //           <span className={styles.digitBox}>{minutes[0]}</span>
  //           <span className={styles.digitBox}>{minutes[1]}</span>
  //           <span className={styles.digitBox}>{seconds[0]}</span>
  //           <span className={styles.digitBox}>{seconds[1]}</span>
  //         </span>
  //       </div>
  //     </div>
  //   </div>
  // );


};

export default AnalogClock;
