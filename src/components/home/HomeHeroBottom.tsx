const HomeHeroBottom = () => {
  return (
    <section className="relative min-h-[400px] w-full">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'url("https://catalogue.visionnaire-home.com/sites/default/files/styles/max_2600x2600/public/space/images-gallery/Visionnaire_VilladEste_room_000.jpg?itok=V8WxBbIB&_gl=1*o9sw5e*_up*MQ..*_ga*NTM5OTM5MDUxLjE3NDAxNzAyNzg.*_ga_4D36DB6FV2*MTc0MDE3MDI3OC4xLjEuMTc0MDE3MDQxMS4wLjAuMA..")',
        }}
      >
        {/* Light black overlay (optional) */}
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Bottom fade overlay (from transparent to white) */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent to-white" />

      {/* Content area */}
      <div className="relative h-full min-h-[400px] flex flex-col items-center justify-center text-center px-4 py-16">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-4">
          {/* Your heading here */}
        </h2>
      </div>
    </section>
  );
};

export default HomeHeroBottom;
