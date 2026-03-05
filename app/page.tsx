"use client"
import React from 'react'
import { Button } from '@/components/ui/button'
import { LucideStars } from 'lucide-react'
// import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ImageGlider from '@/components/ImageComponent/ImageGlider'




export default function Home() {
  // const router = useRouter()

  return (
    <div className='w-full min-h-screen bg-zinc-50'>
      <div className='flex flex-row items-center justify-between bg-zinc-100 px-4 py-2'>
        <p className='text-sm'>Mindmap</p>
        
        <Button variant={'outline'} className='text-center text-xs shadow-md shadow-zinc-100 py-[2px]' >
          <Link href={'/dashbaord'}>Create</Link>
        </Button>

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
                  <Link href={'https://github.com/trydevemanish/mindMap'}>
                  <span>Star on github</span>
                  </Link> 
                </button>

                <button className='text-xs bg-purple-200 hover:bg-purple-300 px-7 rounded-md py-[7px]'>
                  <Link href={'/dashboard'}>Start Creating</Link>
                </button>

              </div>
              <p className='text-xs font-extralight opacity-60'>free & ease to use.</p>
            </div>
          </div> 
        </div>
      </div>

      {/* Image section  */}
      <ImageGlider />
      
      <div className='text-xs bg-zinc-100 flex flex-row w-full justify-between p-24 pt-8 pb-2 text-center'>
        <p className='opacity-80 text-purple-700'>Made be me - manish</p>
        <p className='opacity-80'>@Mindmap</p>
      </div>
    </div>
  )
}
