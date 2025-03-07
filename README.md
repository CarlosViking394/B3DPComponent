# 3D Printing Service App

A mobile application for 3D printing services that allows users to upload 3D models, calculate printing costs, and explore different printing materials.

## Features

- Upload 3D model files
- Calculate printing costs based on material and thickness
- Explore different printing materials and their properties
- Material details with technical specifications
- User-friendly interface with tab navigation

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (or physical device)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/CarlosViking394/B3DPComponent.git
   cd B3DPComponent
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npx expo start
   ```

4. Run on a device or simulator:
   - Press `i` to open in iOS Simulator
   - Press `a` to open in Android Emulator
   - Scan the QR code with the Expo Go app on your physical device

## Project Structure

- `app/` - Main application screens and navigation
  - `(tabs)/` - Tab-based navigation screens
  - `materialDetails.tsx` - Material details screen
- `components/` - Reusable UI components
  - `CostCalculator.tsx` - Cost calculation component
  - `MaterialDetails.tsx` - Material details component
  - `MaterialInfoCard.tsx` - Material information card component
- `data/` - Data files
  - `materialDescriptions.ts` - Material descriptions
  - `materialResonanceData.ts` - Material technical data

## Recent Fixes

- Fixed slider precision error in the cost calculator
- Resolved tab name visibility issues
- Added comprehensive material details pages
- Fixed navigation between screens

## Development


