"use client"
import React from 'react'
import { Button } from '@/components/ui/button'
import Image, { StaticImageData } from 'next/image'
import SequenceDiagram from '@/public/sd.png'
import graph1 from '@/public/gh.png'
import Quadrant from '@/public/qua.png'
import Model from '@/public/modal.png'
import Custom from '@/public/cusmi.png'
import { LucideStars } from 'lucide-react'
import { useRouter } from 'next/navigation'


type imageDataType = {
  src:StaticImageData,
  alt:string;
  diagramtype:string;
}

const imageData = [
  {
    src:SequenceDiagram,
    alt:'sequence diagram',
    diagramtype:'Sequence diagram'
  },
  {
    src:graph1,
    alt:'graph1 diagram',
    diagramtype:'graph diagram'
  },
  {
    src:Custom,
    alt:'mindmap diagram',
    diagramtype:'Custom mindmap'
  },
  {
    src:Quadrant,
    alt:'quadrant diagram',
    diagramtype:'Quadrant diagram'
  },
  {
    src:Model,
    alt:'model diagram',
    diagramtype:'Model diagram'
  }
]


export default function Home() {
  const router = useRouter()

  return (
    <div className='w-full min-h-screen bg-zinc-50'>
      <div className='flex flex-row items-center justify-between bg-zinc-100 px-4 py-2'>
        <p className='text-sm'>Mindmap</p>
        <Button variant={'outline'} className='text-center text-xs shadow-md shadow-zinc-100 py-[2px]' onClick={() => router.push('/dashboard')}>Create</Button>
      </div>
      <div className='flex flex-col items-center bg-gradient-to-b from-zinc-50 via-purple-50 to-zinc-50 justify-center min-h-[calc(97vh-4rem)]'>
        <div className='flex flex-col items-center gap-6'>
          <p className='text-xs text-center border rounded-3xl px-6 py-[6px] shadow-md shadow-purple-100'>
            <span className='font-thin opacity-70'>Made with gemini, reactnode & mermaid.. </span>
          </p>
          <div className='flex flex-col items-center gap-4'>
            <p className='text-6xl text-center max-w-[50rem] leading-tight'>Generate stunning <br /> Visual representations!</p>  
            <p className='text-xs text-center max-w-72 opacity-80 text-wrap'>Create custom mindmaps, Generate stunning visual representation, flowchart,sequenceDiagrams, mindmap & much more....</p>
            <div className='flex flex-col items-center pt-4 gap-[8px]'>
              <div className='flex flex-row gap-4'>
                <button className='text-xs border hover:bg-zinc-200 shadow-md shadow-purple-50 px-7 rounded-md py-[7px] flex flex-row items-center gap-1'>
                  <LucideStars className='size-3' />
                  <span>Star on github</span>
                </button>
                <button className='text-xs bg-purple-200 hover:bg-purple-300 px-7 rounded-md py-[7px]' onClick={() => router.push('/dashboard')}>Start Creating</button>
              </div>
              <p className='text-xs font-extralight opacity-60'>free & ease to use.</p>
            </div>
          </div> 
        </div>
      </div>
      {/* Image section  */}
      <div className='xs:hidden xs:invisible md:visible md:block flex flex-row items-end max-h-[30rem] overflow-hidden'>
        {
          imageData.map((data:imageDataType,idx:number) => (
            <div key={idx} className='flex flex-col items-center bg-zinc-100'>
              <Image 
                src={data.src} 
                alt={data.alt} 
                className={`
                  ${
                    idx % 2 == 0 ?
                    'w-[250px] h-[280px] object-cover transition-transform duration-300 hover:scale-105 hover:-translate-y-3 hover:shadow-xl hover:shadow-purple-200 rounded-t-lg border-t border-zinc-300'
                    :
                    'w-[300px] h-[350px] object-cover transition-transform duration-300 hover:scale-105 hover:-translate-y-3 hover:shadow-xl hover:shadow-purple-200'
                  }
                `}
              />
              <p className='text-xs py-1 text-pretty opacity-60 font-light'>{data?.diagramtype}</p>
            </div>
          ))
        }
      </div>
      <div className='text-xs bg-zinc-100 flex flex-row w-full justify-between p-24 pt-8 pb-2 text-center'>
        <p className='opacity-80 text-purple-700'>Made be me - manish</p>
        <p className='opacity-80'>@Mindmap</p>
      </div>
    </div>
  )
}
