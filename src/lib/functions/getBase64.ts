import { getPlaiceholder } from "plaiceholder";

export default async function getBase64(imageUrl: string) {
  try {
    if (imageUrl) {
      const res = await fetch(imageUrl, { next: { revalidate: 86400 }, signal: AbortSignal.timeout(3000) });

      if (!res.ok) {
        throw new Error(`Failed to fetch image: ${res.status} ${res.statusText}`);
      }

      const buffer = await res.arrayBuffer();

      const { base64 } = await getPlaiceholder(Buffer.from(buffer));

      return base64;
    } else {
      return imageUrl;
    }
  } catch (e) {
    if (e instanceof Error) console.log(e.stack);
    return imageUrl;
  }
}
