---
sidebar_position: 5
---

# Setup & Operation

## Overview

This section guides you through the complete setup and operation of the Argus VTS system. If properly planned, setup should take around **5 minutes**.

### Quick Setup Checklist

- [ ] Machine Access Point physical setup (5 steps)
- [ ] Power on all Access Points (FIRST!)
- [ ] Sync cameras to mesh network
- [ ] Power up trainer tablet
- [ ] Verify all video feeds
- [ ] Test network quality
- [ ] Start operation

## Machine Access Point Setup

The Machine AP is designed to provide optimal antenna placement when operating but to pack away compactly for storage. It requires a simple physical setup for deployment.

### 5-Step Deployment Process

Follow these steps to set up the Machine AP:

1. **Unfold Lower Antennas**
   - Pick the Machine AP up out of the hard case
   - Fold out the lower two antennas

![Step 1: Unfold Lower Antennas](/img/vts-guide/image32.png)

2. **Rotate Antenna Mast**
   - Unclip the Antenna mast
   - Rotate it towards the upward position

![Step 2: Rotate Antenna Mast](/img/vts-guide/image24.png)

3. **Engage Locking Pin**
   - Pull the latch loop
   - Engage the locking pin once the mast is in the vertical position

![Step 3: Engage Locking Pin](/img/vts-guide/image25.png)

4. **Position All Antennas**
   - Rotate two of the antennas so their elbow joints point upwards
   - Fold all antennas at their 45 degree latched position

![Step 4: Position Antennas](/img/vts-guide/image21.png)

5. **Ready for Deployment**
   - The Machine node is now ready to be mounted & powered on

:::tip Quick Setup
Once you perform this setup a few times, it becomes second nature and takes less than a minute!
:::

## Access Points and Cameras Power On

### Critical: Power On Order

:::danger Important
**ALWAYS turn on Access Points FIRST before powering up other system components.**
:::

![Power Button](/img/vts-guide/corectpowerbutton.png)

*Power button location on access points and cameras*

This ensures the mesh network is fully established before cameras and tablet attempt to connect.

### How to Power On Access Points

To power on the access points:

1. **Press** the large black power button firmly
2. **Release** the button  
3. **Wait** for the access point to initialise (watch for status LED)

![LED Status Indicator](/img/vts-guide/correctstatusled.png)

### Complete Startup Order

1. **Access Points** (ALL of them first)
   - Press power button on each AP
   - Wait for green LED on all units
   - Allow 30-60 seconds for mesh to establish

2. **Cameras (RCS)**
   - Press power button on each camera
   - Listen for lens calibration clicking
   - Wait for green LED on all cameras

3. **Tablet**
   - Press power button (left-hand side, top edge)
   - Wait for boot sequence
   - Open Argus software

4. **Verify All Feeds**
   - Check all cameras appear in Argus software
   - Verify video quality
   - Monitor connection status

## LED Status Reference

### Access Point LED Indicators

The Access Point will cycle from blue to green as it connects to the network:

![LED Status Indicator](/img/vts-guide/correctstatusled.png)

*Access point LED status progression: Initializing → Ready → Connected*

| LED Status | Meaning | Action Required |
|------------|---------|-----------------|
| **Pulsing RGB colours** | Initializing | Wait - system is starting up |
| **Solid Blue** | Ready | Unit powered up, waiting to connect |
| **Solid Green** | Connected | Meshed with other nodes - ready for operation |

:::tip Quick Tip
Turn on all Access Points before starting cameras or other equipment to ensure the mesh network is fully established.
:::

### Camera Sync

Once the access points are meshed (showing solid green), sync the cameras:

![Camera Sync Process](/img/vts-guide/image5.png)

*Remote camera system ready for power on and sync*

**To sync the cameras:**

1. Power on the cameras the same way via the black power button
2. The camera's button Status LED Ring will illuminate **red** when powered
3. A faint **clicking noise** will be heard as the lens calibrates
4. Camera LED will change to **green** when successfully connected to mesh network

### Camera LED Status

| LED Status | Meaning | Action Required |
|------------|---------|-----------------|
| **Pulsing** | Initializing | Wait for lens calibration |
| **Solid Red** | Powered on, syncing | Wait for mesh connection |
| **Solid Green** | Connected to network | Camera feed ready |

:::tip
If any LED remains blue or red for more than 30 seconds, check positioning and line of sight to nearest access point.
:::

## System Validation

Before beginning training operations, verify:

- ✅ All APs show solid green
- ✅ All cameras show solid green
- ✅ Tablet connects to WiFi (ARGUS-VTS-XXX)
- ✅ Argus software shows all camera feeds
- ✅ Network health indicator shows green or orange (not red)
- ✅ Video feed quality is acceptable
- ✅ Recording can be started

## Troubleshooting Startup

### AP Won't Turn On
- Ensure battery is installed and charged
- Hold power button firmly for 2 seconds
- Try different battery

### Camera Won't Sync
- Verify access points are on green status
- Power cycle the camera (off, wait 5s, on)
- Check line of sight from camera to nearest AP

### Tablet Won't Connect
- Verify WiFi name (ARGUS-VTS-XXX visible)
- Use password: BarmincoVTS
- Restart tablet if connection drops

### Poor Video Quality
- Check network health indicator
- Move Access Points for better coverage
- Ensure minimum 30m distance between static APs
- Reduce number of simultaneous recordings

---

**Next**: [Tablet Setup](/docs/setup-operation/tablet-setup) or [Vehicle Configuration](/docs/setup-operation/vehicle-setup)
