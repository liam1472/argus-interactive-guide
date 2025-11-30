import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const quickStartSections = [
  {
    title: 'Setup',
    description: 'Complete physical deployment and power-on sequence. Get your system ready for operation.',
    image: '/img/vts-guide/setup-complete-banner.png',
    link: '/quick-start/setup',
    steps: [
      'Machine AP physical setup',
      'Mounting on vehicle',
      'Camera positioning',
      'Power-on sequence',
      'System verification'
    ]
  },
  {
    title: 'Operation',
    description: 'Learn how to use the Argus software, view feeds, record sessions, and monitor network health.',
    image: '/img/vts-guide/argus-software.jpg',
    link: '/quick-start/operation',
    steps: [
      'Launch Argus software',
      'View camera feeds',
      'Start recording',
      'Monitor network health',
      'Manage recordings'
    ]
  }
];

export default function QuickStart() {
  const bannerUrl = useBaseUrl('/img/vts-guide/main-banner.png');
  // Call useBaseUrl for all images at top level to avoid hook rule violations
  const setupImageUrl = useBaseUrl('/img/vts-guide/setup-complete-banner.png');
  const operationImageUrl = useBaseUrl('/img/vts-guide/argus-software.jpg');
  
  // Map sections with resolved image URLs
  const sectionsWithImages = quickStartSections.map((section, idx) => ({
    ...section,
    imageUrl: idx === 0 ? setupImageUrl : operationImageUrl
  }));
  
  return (
    <Layout title="Quick Start Guide" description="Visual quick start guides for Argus VTS">
      <div 
        className={styles.container}
        style={{
          backgroundImage: `url(${bannerUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          position: 'relative',
          minHeight: 'calc(100vh - var(--ifm-navbar-height))'
        }}
      >
        <div className={styles.overlay} />
        <div className={styles.contentWrapper}>
          <div className={styles.header}>
            <h1 className={styles.title}>Quick Start Guide</h1>
            <p className={styles.subtitle}>
              Step-by-step visual guides to get you up and running quickly
            </p>
          </div>

          <div className={styles.optionsGrid}>
          {sectionsWithImages.map((section, idx) => (
            <Link
              key={idx}
              to={section.link}
              className={styles.optionCard}
            >
              <div className={styles.cardImage}>
                <img src={section.imageUrl} alt={section.title} />
              </div>
              <div className={styles.cardContent}>
                <div className={styles.cardIcon}>{section.icon}</div>
                <h2 className={styles.cardTitle}>{section.title}</h2>
                <p className={styles.cardDescription}>{section.description}</p>
                {section.steps && (
                  <ul className={styles.stepsPreview}>
                    {section.steps.map((step, stepIdx) => (
                      <li key={stepIdx}>{step}</li>
                    ))}
                  </ul>
                )}
                <div className={styles.cardLink}>
                  Start {section.title} →
                </div>
              </div>
            </Link>
          ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem', width: '100%' }}>
            <p style={{ color: '#ffffff', textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)' }}>
              Need more detail? Check out the{' '}
              <Link to="/docs/setup-operation/" style={{ color: 'var(--ifm-color-primary)' }}>full manual</Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

