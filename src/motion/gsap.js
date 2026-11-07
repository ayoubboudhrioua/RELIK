// One place that registers the GSAP plugins RELIK uses.
// Import gsap, ScrollTrigger, SplitText and useGSAP from here, not from the
// packages, so every file gets the same registered copy.
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)

export { gsap, ScrollTrigger, SplitText, useGSAP }
