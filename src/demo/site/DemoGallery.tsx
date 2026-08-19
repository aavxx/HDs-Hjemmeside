/**
 * Galleriet er endnu ikke klar – siden viser kun "Kommer snart",
 * indtil der er billeder af værkerne at vise.
 */
export default function DemoGallery() {
  return (
    <div className="container py-24 text-center md:py-36">
      <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">Galleri</p>
      <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Kommer snart…</h1>
      <div className="mx-auto mt-6 h-[2px] w-12 bg-foreground" />
    </div>
  );
}
