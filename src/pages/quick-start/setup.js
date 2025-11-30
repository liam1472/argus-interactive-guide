import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Carousel from '@site/src/components/Carousel';
import styles from './styles.module.css';

const slides = [
  {
    title: 'Overview & Pre-Deployment Check',
    image: '/img/vts-guide/kit-contents-clean.png',
    content: 'Complete setup should take around 5 minutes if properly planned.',
    steps: [
      'Ensure all batteries are charged before heading underground',
      'Verify all kit components are ready for operation',
      'Check Machine AP, Repeater APs (if needed), and all 4 cameras',
      'Verify tablet is charged and ready'
    ]
  },
  {
    title: 'Machine AP Setup - Unfold Antennas',
    image: '/img/vts-guide/machine-node-setup-2.png',
    content: 'Pickup the Machine AP from the case and unfold the lower two antennas from their storage position beneath the carbon fibre plate.'
  },
  {
    title: 'Machine AP Setup - Rotate Mast & Engage Locking Pin',
    image: '/img/vts-guide/machine-node-setup-3.png',
    content: 'Unclip the antenna mast and rotate it upwards, then pull the latch loop and engage the locking pin once the mast is in the vertical position.'
  },
  {
    title: 'Machine AP Setup - Position Antennas',
    image: '/img/vts-guide/machine-node-setup-4.png',
    content: 'Rotate two of the antennas so their elbow joints point upwards, then fold all antennas at their 45 degree latched position. The Machine AP is now ready to be mounted and powered on.'
  },
  {
    title: 'Mount Machine AP on Vehicle',
    image: '/img/vts-guide/machine-ap-rear.png',
    content: 'For underground loader training, mount the Machine AP on the rear of the vehicle on top of the radiator.',
    steps: [
      'Position on rear of vehicle, on top of radiator',
      'Ensure clear line-of-sight to the on vehicle camera positions',
      'Mount securely on an even metal surfaceto prevent movement during operation',
      'Verify elevated position for optimal signal propagation to other APs'
    ]
  },
  {
    title: 'Deploy Repeater APs (If Needed)',
    image: '/img/vts-guide/antennas-up-render.jpg',
    content: 'Repeater APs extend network coverage for safe trainer positioning at significant distances (200m+) or around corners.',
    steps: [
      'Position at height equal to or higher than Machine AP',
      'Ensure clear line of sight to other APs',
      'Mount using magnetic feet or hooks on metal surfaces',
      'Configure antennas: both up for straight runs, one up/one down for corners'
    ]
  },
  {
    title: 'Rear Camera Position',
    image: '/img/vts-guide/rcs-rear-quarter.png',
    content: 'Mount rear camera (magnetic mount) to observe:',
    steps: [
      'Overall vehicle operation from behind',
      'Ingress of any other vehicles or people into the operational area'
    ]
  },
  {
    title: 'Forward Bucket View',
    image: '/img/vts-guide/rcs-forward.png',
    content: 'Mount forward-facing camera (magnetic mount) to observe:',
    steps: [
      'Bucket positioning and movement from above',
      'Loading technique',
      'Material engagement',
      'Forward ground surface conditions'
    ]
  },
  {
    title: 'Front Side View',
    image: '/img/vts-guide/rcs-bucket-view.png',
    content: 'Mount front side camera (magnetic mount) to observe:',
    steps: [
      'Bucket approach angle',
      'Tire position relative to obstacles',
      'Side clearances',
      'Bucket cutting edge alignment'
    ]
  },
  {
    title: 'Cab Interior Camera',
    image: '/img/vts-guide/rcs-cab.png',
    content: 'Mount interior camera using suction cups on glass to observe:',
    steps: [
      'Trainee position in operator cabin',
      'Control inputs and operating technique',
      'Trainee awareness and reactions',
      'Proper cab procedures'
    ]
  },
  {
    title: 'Power On - Access Points FIRST',
    image: '/img/vts-guide/ap-power-button.png',
    content: 'CRITICAL: Always turn on Access Points FIRST before powering up other system components. This ensures the mesh network is fully established.',
    warning: true,
    steps: [
      'Press the large black power button firmly',
      'Release the button immediately',
      'Wait for access point to initialise (watch LED status)',
      'Wait for solid green LED on all AP units',
      'Allow 30-60 seconds for mesh network to establish'
    ]
  },
  {
    title: 'Power On - Cameras',
    image: '/img/vts-guide/rcs-power-up.png',
    content: 'Once all Access Points show solid green, power on the cameras.',
    steps: [
      'Press power button on each camera',
      'LED will illuminate red when powered',
      'Listen for faint clicking noise as lens calibrates'
    ]
  },
  {
    title: 'Power On - Tablet',
    image: '/img/vts-guide/tablet-buttons.png',
    content: 'Power on the trainer tablet PC.',
    steps: [
      'Locate power button on top edge, left-hand side (leftmost of three buttons)',
      'Press power button to turn on tablet',
      'Wait for boot sequence to complete',
      'Tablet will be ready for login'
    ]
  },
  {
    title: 'Tablet Login & App Launch',
    image: '/img/vts-guide/argus-software.jpg',
    content: 'Login to windows using the PIN 2580 and launch the Argus software.',
    steps: [
      'Swipe up from the lock screen to show the Argus VTS user login page',
      'Enter the Windows Tablet PIN: 2580',
      'Click the Argus applcation icon in the task bar to launch the software',
      'Wait for the software to initialise (10-15 seconds)',
      'All 4 camera feeds should start streaming automatically'
    ]
  },
  {
    title: 'System Verification',
    image: '/img/vts-guide/system-verification.png',
    content: 'Before beginning training operations, verify everything is working correctly.',
    noNumbers: true,
    steps: [
      '✅ All Access Points show solid green LED',
      '✅ All cameras show solid green LED',
      '✅ Tablet is connected to WiFi (ARGUS-VTS-XXX)',
      '✅ All components are powered and ready',
      '✅ Camera feeds are streaming'
    ]
  },
  {
    title: 'Setup Complete!',
    image: '/img/vts-guide/setup-complete-banner.png',
    content: 'Your Argus VTS system is now physically set up and powered on. Proceed to the Operation guide to learn how to use the Argus software and start training.',
    steps: [
      'All hardware is deployed and powered',
      'Mesh network is established',
      'Cameras are connected',
      'Camera feeds are streaming',
      'Ready to proceed to Operation guide'
    ]
  }
];

export default function SetupQuickStart() {
  const bannerUrl = useBaseUrl('/img/vts-guide/main-banner.png');
  
  return (
    <Layout title="Setup - Quick Start" description="Complete physical deployment and power-on sequence">
      <div 
        style={{ 
          padding: '1rem 1rem 0', 
          width: '100%', 
          margin: 0, 
          height: 'calc(100vh - var(--ifm-navbar-height))',
          backgroundImage: `url(${bannerUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          position: 'relative'
        }}
      >
        <div 
          className={styles.backgroundOverlay}
          style={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'var(--ifm-background-color)',
            opacity: '0.85',
            zIndex: 1
          }} 
        />
        <div style={{ 
          position: 'relative',
          zIndex: 2,
          marginBottom: '1rem', 
          textAlign: 'center', 
          maxWidth: '1400px', 
          marginLeft: 'auto', 
          marginRight: 'auto' 
        }}>
          <Link to="/quick-start/" className={styles.backLink}>
            ← Back to Quick Start
          </Link>
        </div>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <Carousel slides={slides} />
        </div>
      </div>
    </Layout>
  );
}

