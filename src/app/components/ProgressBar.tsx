'use client'

import React from 'react'
import * as Progress from '@radix-ui/react-progress'

interface ProgressBarProps {
  progress: number
  speed: string
  eta: string
  showStats?: boolean
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  speed, 
  eta, 
  showStats = true 
}) => {
  // Pastikan nilai default yang valid
  const displaySpeed = speed || '-'
  const displayEta = eta || '-'
  
  return (
    <div className="w-full">
      <div className="mb-2 flex flex-col sm:flex-row sm:justify-between text-sm">
        <span className="font-medium text-lg">{Math.round(progress)}%</span>
        
        {/* Selalu tampilkan stats tanpa kondisi */}
        <div className="flex flex-col sm:flex-row sm:gap-4 mt-1 sm:mt-0">
          <span className="flex gap-1">
            <span className="text-gray-500 font-medium">Kecepatan:</span> 
            <span className="text-blue-600">{displaySpeed}</span>
          </span>
          <span className="flex gap-1">
            <span className="text-gray-500 font-medium">Estimasi:</span> 
            <span className="text-blue-600">{displayEta}</span>
          </span>
        </div>
      </div>
      <Progress.Root
        className="relative h-4 w-full overflow-hidden rounded-full bg-gray-200"
        style={{ transform: 'translateZ(0)' }}
        value={progress}
      >
        <Progress.Indicator
          className="h-full w-full bg-blue-500 transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${100 - progress}%)` }}
        />
      </Progress.Root>
    </div>
  )
}

export default ProgressBar 