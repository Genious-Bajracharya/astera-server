// import fetch from 'node-fetch'

// utils/getBlurDataURL.ts
// export const getBlurDataURL = async (url: string): Promise<string | null> => {
//   try {
//     if (!url) return null
//     const { default: fetch } = await import('node-fetch');
//     const prefix = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/`
//     const suffix = url.split(prefix)[1]
//     const response = await fetch(
//       `${prefix}w_100,e_blur:5000,q_auto,f_auto/${suffix}`
//     )

//     const buffer = await response.arrayBuffer()
//     const base64 = Buffer.from(buffer).toString('base64')
//     return `data:image/png;base64,${base64}`
//   } catch (err) {
//     console.error('Failed to generate blurDataURL:', err)
//     return null
//   }
// }
