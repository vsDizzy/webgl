export async function load(url: string) {
  const res = await fetch(url);
  return await res.text();
}
