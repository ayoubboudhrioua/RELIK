// Every photograph shown on RELIK, with its author, licence and source page.
// Sources: photos/objects/CREDITS.md and photos/photographs/CREDITS.md,
// with each Wikimedia Commons page checked against the file's author.
// The /credits page renders this list. Keep it in sync when adding a photo.

const COMMONS = 'https://commons.wikimedia.org/wiki/'

export const LICENCES = {
  'CC BY-SA 4.0': 'https://creativecommons.org/licenses/by-sa/4.0/',
  'CC BY-SA 3.0': 'https://creativecommons.org/licenses/by-sa/3.0/',
  'CC BY 4.0': 'https://creativecommons.org/licenses/by/4.0/',
  'CC BY 2.0': 'https://creativecommons.org/licenses/by/2.0/',
  CC0: 'https://creativecommons.org/publicdomain/zero/1.0/',
  'Public domain': null,
  'Copyrighted free use': null,
}

function credit(file, subject, author, licence, commonsTitle) {
  return {
    file,
    subject,
    author,
    licence,
    licenceUrl: LICENCES[licence] ?? null,
    source: COMMONS + encodeURI(commonsTitle.replace(/ /g, '_')).replace(/\?/g, '%3F'),
  }
}

export const photoCredits = [
  credit('objects/walkman.webp', 'Sony Walkman TPS-L2 (1979), front', 'Binarysequence', 'CC BY-SA 4.0', 'File:Original Sony Walkman TPS-L2.JPG'),
  credit('objects/walkman-side.webp', 'Sony Walkman TPS-L2, three-quarter view', 'Anna Gerdén', 'CC BY-SA 3.0', 'File:Walkman TPS-L2.jpg'),
  credit('objects/mac-classic.webp', 'Apple Macintosh Classic (1990) with keyboard and mouse', 'Christian Brockmann', 'Copyrighted free use', 'File:Mac Classic.jpg'),
  credit('objects/gameboy.webp', 'Nintendo Game Boy DMG-01 (1989)', 'Evan-Amos', 'Public domain', 'File:Game-Boy-Original.jpg'),
  credit('objects/mavica.webp', 'Sony Digital Mavica MVC-FD85 (c. 2000)', 'Moki8', 'CC BY-SA 4.0', 'File:Sony Mavica FD-85 (cropped).jpg'),
  credit('objects/qv10.webp', 'Casio QV-10 (1995)', 'Morio', 'CC BY-SA 3.0', 'File:Casio QV-10 CP+ 2011.jpg'),
  credit('objects/polaroid-sx70.webp', 'Polaroid SX-70 Land Camera (1972)', 'Thomas Backa', 'CC0', 'File:Polaroid SX-70 (4462345243).jpg'),
  credit('objects/handycam.webp', 'Sony Handycam Vision (Video8)', 'Assianir', 'CC BY-SA 3.0', 'File:Sony CCD-TRV27E PAL 20161010.jpg'),
  credit('objects/vhs.webp', 'VHS videocassette', 'LoMit', 'CC BY-SA 4.0', 'File:VHS videocassette - front.jpg'),
  credit('objects/floppy-disk.webp', '3.5-inch floppy disk (Samsung MF-2HD)', 'Peter Astbury', 'CC0', 'File:Samsung 3.5 inch floppy disk 20110519.jpg'),
  credit('objects/cassette.webp', 'Compact Cassette, TDK D90', 'Wikimedia Commons contributor', 'CC BY-SA 3.0', 'File:Audio cassette TDK D90 (1).jpg'),
  credit('objects/minidisc.webp', 'Sony MiniDisc', 'liamz2r', 'Public domain', 'File:Sony Topaz Yellow MiniDisc.png'),
  credit('objects/rio.webp', 'Diamond Rio PMP300 (1998)', 'Targaryen', 'CC0', 'File:Diamond Rio PMP300.jpg'),
  credit('objects/discman.webp', 'Sony Discman D-50, open', 'Binarysequence', 'CC BY-SA 4.0', 'File:Sony D50 Discman Open.JPG'),
  credit('objects/c64.webp', 'Commodore 64 (1982)', 'Evan-Amos', 'Public domain', 'File:Commodore-64-Computer-FL.png'),
  credit('objects/atari-2600.webp', 'Atari 2600, four-switch wood-grain model', 'Evan-Amos', 'Public domain', 'File:Atari-2600-Wood-4Sw-Set.png'),
  credit('objects/minitel.webp', 'Minitel 1, La Radiotechnique', 'DMontagne en résidence', 'CC BY 4.0', 'File:Minitel 1 La Radiotechnique.jpg'),
  credit('objects/nokia-3310.webp', 'Nokia 3310 (2000)', 'Michael Brandtner', 'Public domain', 'File:Nokia 3310 blue.jpg'),
  credit('objects/pager.webp', 'Motorola LX2 plus pager', 'Starwhooper, derivative by VT98Fan', 'CC BY-SA 3.0', 'File:Motorola Pager LX2 plus.jpg'),
  credit('photographs/walkman-teardown.webp', 'Inside a 1979 TPS-L2 during a teardown', 'Dave Jones', 'CC BY 2.0', 'File:Original 1979 Sony TPS-L2 Walkman Teardown (18042739434).jpg'),
  credit('photographs/minitels-installation.webp', 'Minitel terminals on display, lit by their screens', 'Nicolas Vigier', 'CC0', 'File:Des minitels.jpg'),
  credit('photographs/mac-museum.webp', 'Macintosh Classic on display at Hi-Score, Hannover', 'Robertgzr', 'CC0', 'File:Macintosh Classic im Hi-Score Hannover.jpg'),
  credit('photographs/cd-stack.webp', 'Stacked compact discs, side view', 'Dietmar Rabich', 'CC BY-SA 4.0', 'File:CDs, Seitenansicht -- 2017 -- 2212.jpg'),
  credit('photographs/floppy-shutter.webp', 'The metal shutter of a 3.5-inch floppy disk', 'DiscoA340', 'CC0', 'File:Frontside of a 3.5" Floppy Disk.jpg'),
  credit('photographs/discman-open.webp', 'Sony Discman D-50 with the lid open', 'Binarysequence', 'CC BY-SA 4.0', 'File:Sony D50 Discman Open.JPG'),
]

export function creditFor(file) {
  return photoCredits.find((c) => c.file === file) ?? null
}
