import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sirdaryo Xizmatlari - Ustalar va Xizmatlar Portali",
    short_name: "SirdaryoXizmat",
    description: "Guliston va butun Sirdaryo viloyati bo'yicha ishonchli ustalar va xizmatlar katalogi.",
    start_url: "/",
    display: "standalone",
    background_color: "#fffdfa",
    theme_color: "#ea580c",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
