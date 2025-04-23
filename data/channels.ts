import type { ChannelInfo } from "@/types"

export const channelsList: ChannelInfo[] = [
  {
    id: "M-4zE2GG87w",
    title: "Spring Lofi",
    icon: "https://img.icons8.com/ios-filled/50/spring.png",
  },
  {
    id: "r3JG5gBLbpA",
    title: "Lost in Japan",
    icon: "https://img.icons8.com/material-outlined/24/city.png",
  },
  {
    id: "vrB9wC6quaU",
    title: "Lofi on a Calm Night",
    icon: "https://img.icons8.com/ios/50/balcony.png",
  },
  {
    id: "92PvEVG0sKI",
    title: "Cozy Lofi",
    icon: "https://img.icons8.com/ios-glyphs/30/city-buildings.png",
  },
  {
    id: "hB2LatX6NLg",
    title: "Shibuya Nights",
    icon: "https://img.icons8.com/glyph-neue/64/new-york.png",
  },
  {
    id: "vYIYIVmOo3Q",
    title: "Rainy Rooftop",
    icon: "https://img.icons8.com/ios-glyphs/30/rain--v1.png",
  },
  {
    id: "CX9_h23icoM",
    title: "Lofi on the Radio",
    icon: "https://img.icons8.com/ios-filled/50/radio.png",
  },
  {
    id: "yf5NOyy1SXU",
    title: "Room with City View",
    icon: "https://img.icons8.com/ios-filled/50/empty-bed.png",
  },
  {
    id: "IOOXppTp5co",
    title: "Bear Footprint",
    icon: "https://img.icons8.com/ios-filled/50/bear-footprint.png",
  },
  {
    id: "Fs-RjtIDvbw",
    title: "Coffee Shop",
    icon: "https://img.icons8.com/material-rounded/24/espresso-cup--v1.png",
  },
  {
    id: "tVHNkTBvCtI",
    title: "Hip Hop Lofi",
    icon: "https://img.icons8.com/ios/50/rap.png",
  },
  {
    id: "mF3m7Jza2uc",
    title: "Lofi Beats",
    icon: "https://img.icons8.com/ios-filled/50/musical-notes.png",
  },
  {
    id: "JQtM2tyWAOQ",
    title: "Chinese Lofi",
    icon: "https://img.icons8.com/external-jumpicon-glyph-ayub-irawan/32/external-_39-chinese-new-year-jumpicon-(glyph)-jumpicon-glyph-ayub-irawan.png",
  },
  {
    id: "93AApJk314Q",
    title: "Gas Station",
    icon: "https://img.icons8.com/ios-filled/50/gas-station.png",
  },
  {
    id: "rPjez8z61rI",
    title: "TV Lofi",
    icon: "https://img.icons8.com/ios-filled/50/tv.png",
  },
  {
    id: "techmgGVOhk",
    title: "Frog Lofi",
    icon: "https://img.icons8.com/ios-filled/50/frog.png",
  },
  {
    id: "UedTcufyrHc",
    title: "Floor Lofi",
    icon: "https://img.icons8.com/external-glyph-andi-nur-abdillah/64/external-Floor-outline-(glyph)-glyph-andi-nur-abdillah.png",
  },
  {
    id: "IBKIzCxy55o",
    title: "Sofa Lofi",
    icon: "https://img.icons8.com/material-rounded/24/sofa.png",
  },
  {
    id: "m0hD2iFaSW4",
    title: "Wizard Lofi 1",
    icon: "https://img.icons8.com/ios/50/gandalf.png",
  },
  {
    id: "Mfq3_nvFiFw",
    title: "Wizard Lofi 2",
    icon: "https://img.icons8.com/ios/50/gandalf.png",
  },
  {
    id: "UqS3zt4crtM",
    title: "Bluey Lofi",
    icon: "https://img.icons8.com/ios-filled/50/bluey.png",
  },
  {
    id: "9IOmDeoHSo8",
    title: "Fantasy Lofi",
    icon: "https://img.icons8.com/ios-glyphs/30/fantasy--v1.png",
  },
  {
    id: "7XrwdXTy-p8",
    title: "Adventure Time",
    icon: "https://img.icons8.com/ios/50/jake.png",
  },
  {
    id: "p_oz1qIdJlI",
    title: "Rainy Lofi",
    icon: "https://img.icons8.com/ios-filled/50/rain--v1.png",
  },
  {
    id: "dk6fPqa-uZQ",
    title: "Bible Lofi",
    icon: "https://img.icons8.com/ios-filled/50/holy-bible.png",
  },
  {
    id: "T8Cq3AXBEpM",
    title: "Afro Lofi",
    icon: "https://img.icons8.com/ios-glyphs/30/afro-pick.png",
  },
]

// Add favorites functionality
export type FavoriteChannel = {
  id: string
}

export const getFavoriteChannels = (): FavoriteChannel[] => {
  if (typeof window === "undefined") return []

  const favorites = localStorage.getItem("lofiAppFavorites")
  return favorites ? JSON.parse(favorites) : []
}

export const saveFavoriteChannels = (favorites: FavoriteChannel[]) => {
  if (typeof window === "undefined") return

  localStorage.setItem("lofiAppFavorites", JSON.stringify(favorites))
}

export const toggleFavorite = (channelId: string) => {
  const favorites = getFavoriteChannels()
  const isFavorite = favorites.some((fav) => fav.id === channelId)

  if (isFavorite) {
    saveFavoriteChannels(favorites.filter((fav) => fav.id !== channelId))
  } else {
    saveFavoriteChannels([...favorites, { id: channelId }])
  }

  return !isFavorite
}

export const isChannelFavorite = (channelId: string): boolean => {
  const favorites = getFavoriteChannels()
  return favorites.some((fav) => fav.id === channelId)
}
