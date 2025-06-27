export const verifyFonts = async () => {
  const fonts = ["/fonts/OpenSans-Regular.ttf", "/fonts/OpenSans-Bold.ttf"];

  const results = await Promise.all(
    fonts.map(async (path) => {
      try {
        const res = await fetch(path);
        return {
          path,
          status: res.ok ? "✅ Available" : "❌ Missing",
          size: res.ok ? `${(await res.blob()).size} bytes` : "",
        };
      } catch {
        return { path, status: "❌ Failed to load", size: "" };
      }
    })
  );

  console.table(results);
};

// Call this in your app startup
verifyFonts();
