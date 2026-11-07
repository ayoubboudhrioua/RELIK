import { usePageTitle } from '../../hooks/usePageTitle.js'
import { en } from '../../content/en.js'
import { Hero } from './Hero.jsx'
import { ShapedRack } from './ShapedRack.jsx'
import { WalkmanStory } from './WalkmanStory.jsx'
import { LogbookTeaser } from './LogbookTeaser.jsx'
import { LabTeaser } from './LabTeaser.jsx'
import { MuseumTeaser } from './MuseumTeaser.jsx'
import { Closing } from './Closing.jsx'

// The home page: the exhibition. Each section is one room of the store room.
export function Home() {
  usePageTitle(en.home.pageTitle)
  return (
    <>
      <Hero />
      <ShapedRack />
      <WalkmanStory />
      <LogbookTeaser />
      <LabTeaser />
      <MuseumTeaser />
      <Closing />
    </>
  )
}
