import React from 'react'
import Image, { StaticImageData } from 'next/image'
import SequenceDiagram from '@/public/sd.png'
import graph1 from '@/public/gh.png'
import Quadrant from '@/public/qua.png'
import Model from '@/public/modal.png'
import Custom from '@/public/cusmi.png'

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


export default function ImageGlider() {
  return (
    <div className='xs:hidden xs:invisible md:visible md:flex md:flex-row md:items-end md:max-h-[30rem] md:overflow-hidden'>
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
  )
}
