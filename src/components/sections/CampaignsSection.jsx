import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ExternalLink, Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCampaigns } from '@/hooks/useCampaigns';
import { Skeleton } from '@/components/ui/skeleton';

// â”€â”€ YouTube helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function getYoutubeId(url) {
    if (!url) return null;
    // Regex cubre todos los formatos conocidos de YouTube
    const match = url.match(
        /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/|v\/))([-\w]{11})/
    );
    return match ? match[1] : null;
}

function isYoutubeUrl(url) {
    if (!url) return false;
    return /youtu(?:\.be|be\.com)/i.test(url);
}

function getYoutubeThumbnail(url) {
    const id = getYoutubeId(url);
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

function getYoutubeEmbed(url) {
    const id = getYoutubeId(url);
    if (id) return `https://www.youtube.com/embed/${id}?autoplay=1`;
    // Fallback: si es una URL de YouTube pero no pudimos extraer el ID,
    // la pasamos directo al src del iframe (YouTube lo acepta)
    if (isYoutubeUrl(url)) return url.replace('watch?v=', 'embed/');
    return url;
}

// Determina el medio a mostrar respetando media_type explÃ­cito; fallback graceful para datos viejos.
function resolveMedia(campaign) {
    const type = campaign.media_type || (campaign.video_url && !campaign.image_url ? 'video' : 'image');
    if (type === 'video' && campaign.video_url) {
        return { type: 'video', src: campaign.video_url, thumbnail: getYoutubeThumbnail(campaign.video_url) };
    }
    if (campaign.image_url) {
        return { type: 'image', src: campaign.image_url, thumbnail: campaign.image_url };
    }
    // fallback: thumbnail de YouTube si hay video_url aunque media_type sea image
    const ytThumb = getYoutubeThumbnail(campaign.video_url);
    if (ytThumb) return { type: 'video', src: campaign.video_url, thumbnail: ytThumb };
    return { type: 'none', src: null, thumbnail: null };
}

// â”€â”€ Slide variants para AnimatePresence â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? '60%' : '-60%', opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: (dir) => ({ x: dir > 0 ? '-60%' : '60%', opacity: 0, transition: { duration: 0.25, ease: 'easeIn' } }),
};

// â”€â”€ Video modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function VideoModal({ campaign, onClose }) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={onClose}
        >
            <div className="relative w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
                <button
                    onClick={onClose}
                    className="absolute -top-10 right-0 text-white/80 hover:text-white transition-colors"
                    aria-label="Cerrar video"
                >
                    <ChevronLeft className="h-7 w-7 rotate-90" />
                </button>
                <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black shadow-2xl">
                    {getYoutubeId(campaign.video_url) || isYoutubeUrl(campaign.video_url) ? (
                        <iframe
                            src={getYoutubeEmbed(campaign.video_url)}
                            title={campaign.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                        />
                    ) : (
                        <video src={campaign.video_url} controls autoPlay className="w-full h-full" />
                    )}
                </div>
            </div>
        </div>
    );
}

// â”€â”€ CampaignFlipCard â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function CampaignFlipCard({ campaign, isFlipped, onFlip, onPlayVideo }) {
    const media = resolveMedia(campaign);

    const handlePlayClick = (e) => {
        e.stopPropagation();
        onPlayVideo(campaign);
    };

    return (
        <div
            className="w-full cursor-pointer select-none"
            style={{ perspective: '1200px' }}
            onClick={onFlip}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onFlip()}
            aria-label={isFlipped ? `Ver medio de ${campaign.title}` : `Ver detalle de ${campaign.title}`}
        >
            <div
                style={{
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    position: 'relative',
                    height: '380px',
                }}
            >
                {/* â”€â”€ Cara A: medio â”€â”€ */}
                <div
                    className="absolute inset-0 rounded-2xl overflow-hidden bg-muted shadow-lg"
                    style={{ backfaceVisibility: 'hidden' }}
                >
                    {media.thumbnail ? (
                        <img
                            src={media.thumbnail}
                            alt={campaign.title}
                            className="w-full h-full object-cover"
                            draggable={false}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                            <span className="text-5xl font-bold text-primary/30">
                                {campaign.title.charAt(0)}
                            </span>
                        </div>
                    )}

                    {/* Overlay inferior con tÃ­tulo */}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <p className="text-white font-semibold text-sm line-clamp-2">{campaign.title}</p>
                    </div>

                    {/* BotÃ³n play si es video */}
                    {media.type === 'video' && (
                        <button
                            onClick={handlePlayClick}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                            aria-label={`Reproducir video: ${campaign.title}`}
                        >
                            <Play className="h-7 w-7 text-primary ml-1" />
                        </button>
                    )}

                    {/* Hint de flip */}
                    <div className="absolute top-3 right-3 bg-black/40 rounded-full p-1.5">
                        <RotateCcw className="h-3.5 w-3.5 text-white/80" />
                    </div>
                </div>

                {/* â”€â”€ Cara B: detalle â”€â”€ */}
                <div
                    className="absolute inset-0 rounded-2xl overflow-hidden bg-card shadow-lg border border-border flex flex-col"
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                    <div className="flex-1 p-6 flex flex-col justify-between overflow-y-auto">
                        <div className="space-y-3">
                            <h3 className="text-lg font-bold text-foreground leading-snug">{campaign.title}</h3>
                            {campaign.description ? (
                                <p className="text-sm text-muted-foreground leading-relaxed">{campaign.description}</p>
                            ) : (
                                <p className="text-sm text-muted-foreground/60 italic">Sin descripciÃ³n.</p>
                            )}
                        </div>
                        <div className="mt-4 flex flex-col gap-2">
                            {campaign.link_url && (
                                <a
                                    href={campaign.link_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                    Ver mÃ¡s
                                </a>
                            )}
                            <p className="text-xs text-muted-foreground text-center">
                                Hacé click para volver
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// â”€â”€ Sección principal

export function CampaignsSection() {
    const { data: campaigns = [], isLoading } = useCampaigns();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(1);
    const [flippedIndex, setFlippedIndex] = useState(null);
    const [videoModal, setVideoModal] = useState(null);
    const touchStartX = useRef(null);

    const total = campaigns.length;
    const canPrev = currentIndex > 0;
    const canNext = currentIndex < total - 1;

    const goTo = (idx) => {
        if (idx === currentIndex) return;
        setDirection(idx > currentIndex ? 1 : -1);
        setFlippedIndex(null);
        setCurrentIndex(idx);
    };

    const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
    const handleTouchEnd = (e) => {
        if (touchStartX.current === null) return;
        const delta = touchStartX.current - e.changedTouches[0].clientX;
        if (Math.abs(delta) > 50) { delta > 0 ? canNext && goTo(currentIndex + 1) : canPrev && goTo(currentIndex - 1); }
        touchStartX.current = null;
    };

    return (
        <section id="campanas" className="section-padding bg-muted/30">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-10"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Campañas</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Nuestras iniciativas para promover la salud mental y el bienestar comunitario.
                    </p>
                </motion.div>

                {isLoading ? (
                    <div className="flex items-center gap-4 justify-center">
                        <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                        <Skeleton className="h-[380px] w-full max-w-sm rounded-2xl" />
                        <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                    </div>
                ) : campaigns.length === 0 ? (
                    <p className="text-center text-muted-foreground">No hay campaÃ±as activas en este momento.</p>
                ) : (
                    <>
                        {/* Slider */}
                        <div className="flex items-center gap-3 md:gap-6 justify-center">
                            <Button
                                variant="outline"
                                size="icon"
                                className="shrink-0 rounded-full h-10 w-10 shadow"
                                onClick={() => canPrev && goTo(currentIndex - 1)}
                                disabled={!canPrev}
                                aria-label="CampaÃ±a anterior"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </Button>

                            <div
                                className="relative overflow-hidden w-full max-w-sm"
                                onTouchStart={handleTouchStart}
                                onTouchEnd={handleTouchEnd}
                            >
                                <AnimatePresence mode="wait" custom={direction}>
                                    <motion.div
                                        key={currentIndex}
                                        custom={direction}
                                        variants={slideVariants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                    >
                                        <CampaignFlipCard
                                            campaign={campaigns[currentIndex]}
                                            isFlipped={flippedIndex === currentIndex}
                                            onFlip={() => setFlippedIndex(flippedIndex === currentIndex ? null : currentIndex)}
                                            onPlayVideo={setVideoModal}
                                        />
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            <Button
                                variant="outline"
                                size="icon"
                                className="shrink-0 rounded-full h-10 w-10 shadow"
                                onClick={() => canNext && goTo(currentIndex + 1)}
                                disabled={!canNext}
                                aria-label="CampaÃ±a siguiente"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Dots */}
                        {total > 1 && (
                            <div className="flex gap-2 justify-center mt-6" role="tablist" aria-label="Navegar campañas">
                                {campaigns.map((_, i) => (
                                    <button
                                        key={i}
                                        role="tab"
                                        aria-selected={i === currentIndex}
                                        aria-label={`CampaÃ±a ${i + 1} de ${total}`}
                                        onClick={() => goTo(i)}
                                        className={`h-2 rounded-full transition-all duration-300 ${
                                            i === currentIndex
                                                ? 'w-6 bg-primary'
                                                : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60'
                                        }`}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            {videoModal && (
                <VideoModal campaign={videoModal} onClose={() => setVideoModal(null)} />
            )}
        </section>
    );
}
