import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const QuickStartIcon = () => (
  <svg className={styles.buttonIcon} width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
      {/* Motion lines */}
      <line x1="20" y1="80" x2="55" y2="80" />
      <line x1="10" y1="100" x2="53" y2="100" />
      <line x1="20" y1="120" x2="55" y2="120" />
      {/* Clock outer ring */}
      <circle cx="120" cy="100" r="65" />
      {/* Clock inner ring */}
      <circle cx="120" cy="100" r="50" />
      {/* Hour hand */}
      <line x1="120" y1="100" x2="135" y2="75" />
      {/* Minute hand */}
      <line x1="120" y1="100" x2="145" y2="110" />
      {/* Hour markers (12, 3, 6, 9) */}
      <line x1="120" y1="52" x2="120" y2="60" />
      <line x1="168" y1="100" x2="160" y2="100" />
      <line x1="120" y1="140" x2="120" y2="148" />
      <line x1="75" y1="100" x2="83" y2="100" />
    </g>
  </svg>
);

const ManualIcon = () => (
  <svg
    className={styles.buttonIcon}
    viewBox="0 0 30 30"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="User manual"
  >
    {/* Book outline, unified stroke width - centered in viewBox */}
    <g fill="none" stroke="currentColor" strokeMiterlimit="10" transform="translate(3, 3)">
      <path
        strokeWidth="0.84"
        d="M1.5,3.41V16.77H9.14A2.86,2.86,0,0,1,12,19.64V6.27A2.86,2.86,0,0,0,9.14,3.41Z"
      />
      <path
        strokeWidth="0.84"
        d="M22.5,3.41V16.77H14.86A2.86,2.86,0,0,0,12,19.64V6.27a2.86,2.86,0,0,1,2.86-2.86Z"
      />
      <polyline
        strokeWidth="0.84"
        points="22.5 16.77 22.5 20.59 14.86 20.59 9.14 20.59 1.5 20.59 1.5 16.77"
      />
      {/* Text lines: left page */}
      <line x1="2.6" y1="7.5" x2="10.3" y2="7.5" strokeWidth="0.4" />
      <line x1="2.6" y1="10.0" x2="10.3" y2="10.0" strokeWidth="0.4" />
      <line x1="2.6" y1="12.5" x2="10.3" y2="12.5" strokeWidth="0.4" />
      {/* Text lines: right page */}
      <line x1="13.7" y1="7.5" x2="21.4" y2="7.5" strokeWidth="0.4" />
      <line x1="13.7" y1="10.0" x2="21.4" y2="10.0" strokeWidth="0.4" />
      <line x1="13.7" y1="12.5" x2="21.4" y2="12.5" strokeWidth="0.4" />
    </g>
  </svg>
);

export default function HomepageFeatures() {
  const bannerUrl = useBaseUrl('/img/vts-guide/main-banner.png');
  
  return (
    <section 
      className={styles.featuresSection}
      style={{
        backgroundImage: `url(${bannerUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative'
      }}
    >
      <div className={styles.overlay} />
      <div className={styles.buttonsContainer}>
        <Link
          className={styles.mainButton}
          to="/quick-start/">
          <QuickStartIcon />
          Quick Start
        </Link>
        <Link
          className={styles.mainButton}
          to="/docs/">
          <ManualIcon />
          Full Manual
        </Link>
      </div>
    </section>
  );
}
