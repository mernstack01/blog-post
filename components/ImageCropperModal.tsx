'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  Check,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Crop as CropIcon,
  Move,
  RotateCcw,
} from 'lucide-react';

export interface ImageCropperModalProps {
  isOpen: boolean;
  imageSrc: string | null;
  aspectRatio?: number; // e.g.: 1 (profile avatar 1:1), 4/3 (listing 4:3)
  cropShape?: 'rect' | 'round'; // 'round' for profile, 'rect' for listing
  title?: string;
  outputWidth?: number;
  outputHeight?: number;
  onCropComplete: (croppedBlob: Blob, croppedDataUrl: string) => Promise<void> | void;
  onClose: () => void;
  lang?: 'uz' | 'ru';
}

export default function ImageCropperModal({
  isOpen,
  imageSrc,
  aspectRatio = 1,
  cropShape = 'rect',
  title,
  outputWidth = 800,
  outputHeight,
  onCropComplete,
  onClose,
  lang = 'uz',
}: ImageCropperModalProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0); // 0, 90, 180, 270
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isProcessing, setIsProcessing] = useState(false);

  // Rasmni tabiiy va boshlang'ich o'lchamlari
  const [naturalSize, setNaturalSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [baseSize, setBaseSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  const imgRef = useRef<HTMLImageElement | null>(null);
  const pinchStartDistRef = useRef<number | null>(null);
  const pinchStartZoomRef = useRef<number>(1);

  // Qirqish ramkasi o'lchamlari (mobil ekranlarga ham to'liq sig'adigan qilib)
  const CROP_BOX_WIDTH = cropShape === 'round' ? 260 : 288;
  const CROP_BOX_HEIGHT = Math.round(CROP_BOX_WIDTH / aspectRatio);

  // Chiqish rasm balandligi
  const targetOutputHeight = outputHeight || Math.round(outputWidth / aspectRatio);

  // Rasm ochilganda yoki o'zgarganda holatni tozalash
  useEffect(() => {
    if (isOpen && imageSrc) {
      setZoom(1);
      setRotation(0);
      setOffset({ x: 0, y: 0 });
      setIsProcessing(false);
      pinchStartDistRef.current = null;
    }
  }, [isOpen, imageSrc]);

  // Rasm yuklanganda bazaviy o'lchamlarni hisoblash
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const nw = img.naturalWidth || 400;
    const nh = img.naturalHeight || 300;
    setNaturalSize({ width: nw, height: nh });

    // Ramkani to'liq qoplab turadigan boshlang'ich masshtab
    const baseScale = Math.max(CROP_BOX_WIDTH / nw, CROP_BOX_HEIGHT / nh);
    setBaseSize({
      width: Math.round(nw * baseScale),
      height: Math.round(nh * baseScale),
    });
  };

  // Drag start (Mouse & Touch)
  const handlePointerDown = (clientX: number, clientY: number) => {
    setIsDragging(true);
    setDragStart({
      x: clientX - offset.x,
      y: clientY - offset.y,
    });
  };

  // Drag move
  const handlePointerMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!isDragging) return;
      setOffset({
        x: clientX - dragStart.x,
        y: clientY - dragStart.y,
      });
    },
    [isDragging, dragStart]
  );

  // Drag end
  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // 90 gradus burish
  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Boshlang'ich holatga qaytarish
  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setOffset({ x: 0, y: 0 });
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.08 : -0.08;
    setZoom((prev) => Math.min(3, Math.max(0.6, Number((prev + delta).toFixed(2)))));
  };

  // Mobile pinch to zoom
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
    } else if (e.touches.length === 2) {
      setIsDragging(false);
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      pinchStartDistRef.current = dist;
      pinchStartZoomRef.current = zoom;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging) {
      handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
    } else if (e.touches.length === 2 && pinchStartDistRef.current !== null) {
      const currentDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const ratio = currentDist / pinchStartDistRef.current;
      const nextZoom = Math.min(3, Math.max(0.6, Number((pinchStartZoomRef.current * ratio).toFixed(2))));
      setZoom(nextZoom);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    pinchStartDistRef.current = null;
  };

  // Canvas yordamida qirqish va eksport qilish
  const handleCrop = async () => {
    const img = imgRef.current;
    if (!img) return;

    setIsProcessing(true);

    try {
      const canvas = document.createElement('canvas');
      canvas.width = outputWidth;
      canvas.height = targetOutputHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Canvas context olishda xatolik');
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // 1. Canvas markaziga siljish
      ctx.translate(canvas.width / 2, canvas.height / 2);

      // 2. Ekrandagi ramkadan canvas o'lchamiga o'tish koeffitsienti
      const scaleToCanvas = outputWidth / CROP_BOX_WIDTH;

      // 3. Foydalanuvchi surgan offsetni qo'llash
      ctx.translate(offset.x * scaleToCanvas, offset.y * scaleToCanvas);

      // 4. Zoom va burishni qo'llash
      ctx.scale(zoom, zoom);
      ctx.rotate((rotation * Math.PI) / 180);

      // 5. Rasmning ekrandagi bazaviy o'lchami canvas nisbatida
      const currentBaseW = baseSize.width || img.naturalWidth || 400;
      const currentBaseH = baseSize.height || img.naturalHeight || 300;
      const drawW = currentBaseW * scaleToCanvas;
      const drawH = currentBaseH * scaleToCanvas;

      // 6. Rasmni markazga chizish
      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);

      // 7. WebP formatida Blob olish
      const croppedBlob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((b) => resolve(b), 'image/webp', 0.92);
      });

      if (!croppedBlob) {
        throw new Error("Blob generatsiya qilib bo'lmadi");
      }

      const croppedDataUrl = canvas.toDataURL('image/webp', 0.92);
      await onCropComplete(croppedBlob, croppedDataUrl);
      onClose();
    } catch (err) {
      console.error('Qirqishda xatolik:', err);
      alert(
        lang === 'ru'
          ? 'Ошибка при обработке изображения'
          : 'Rasmni qayta ishlashda xatolik yuz berdi'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen || !imageSrc) return null;

  const defaultTitle =
    title ||
    (cropShape === 'round'
      ? lang === 'ru'
        ? 'Обрезка фото профиля (1:1)'
        : 'Profil rasmini qirqish (1:1)'
      : lang === 'ru'
      ? 'Обрезка фото для объявления (4:3)'
      : "E'lon rasmini qirqish (4:3)");

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-card text-card-foreground border border-border dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[96vh]">
        {/* Modal Bosh qismi (Header) */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border dark:border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <CropIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-foreground">
                {defaultTitle}
              </h3>
              <p className="text-[11px] text-muted-foreground">
                {cropShape === 'round'
                  ? lang === 'ru'
                    ? 'Круглая рамка 1:1 для аватара'
                    : 'Profil uchun doiraviy 1:1 ramka'
                  : lang === 'ru'
                  ? 'Прямоугольная рамка 4:3 для карточки'
                    : "E'lon uchun to'g'ri to'rtburchak 4:3 ramka"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
            title={lang === 'ru' ? 'Закрыть' : 'Yopish'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Qirqish Maydoni (Workspace Viewport) */}
        <div
          onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
          onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onWheel={handleWheel}
          className="relative w-full h-80 sm:h-96 bg-slate-950 flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing select-none touch-none"
        >
          {/* Harakatlanuvchi Rasm */}
          <div
            style={{
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom}) rotate(${rotation}deg)`,
              transformOrigin: 'center center',
              transition: isDragging ? 'none' : 'transform 0.08s ease-out',
            }}
            className="pointer-events-none will-change-transform flex items-center justify-center"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={imageSrc}
              alt="Crop target"
              crossOrigin="anonymous"
              onLoad={handleImageLoad}
              className="max-w-none max-h-none block"
              style={{
                width: baseSize.width ? `${baseSize.width}px` : 'auto',
                height: baseSize.height ? `${baseSize.height}px` : 'auto',
              }}
              draggable={false}
            />
          </div>

          {/* Ramka Atrofidagi Qoraytirilgan Niqob (Mask Overlay) */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {/* Qirqish oynasi (Crop Window) */}
            <div
              style={{
                width: `${CROP_BOX_WIDTH}px`,
                height: `${CROP_BOX_HEIGHT}px`,
              }}
              className={`relative border-2 border-white/90 shadow-[0_0_0_9999px_rgba(0,0,0,0.65)] ${
                cropShape === 'round' ? 'rounded-full' : 'rounded-2xl'
              }`}
            >
              {/* To'r chiziqlari (3x3 grid) */}
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-25">
                <div className="border-r border-b border-white" />
                <div className="border-r border-b border-white" />
                <div className="border-b border-white" />
                <div className="border-r border-b border-white" />
                <div className="border-r border-b border-white" />
                <div className="border-b border-white" />
                <div className="border-r border-white" />
                <div className="border-r border-white" />
                <div />
              </div>

              {/* Ramka burchaklaridagi nishonlar (faqat rect uchun) */}
              {cropShape === 'rect' && (
                <>
                  <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-blue-400" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-blue-400" />
                  <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-blue-400" />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-blue-400" />
                </>
              )}
            </div>
          </div>

          {/* Surish eslatmasi */}
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] text-white/80 flex items-center gap-1.5 pointer-events-none">
            <Move className="w-3 h-3" />
            <span>
              {lang === 'ru'
                ? 'Перетаскивайте для центрирования'
                : "Surib to'g'irlang"}
            </span>
          </div>
        </div>

        {/* Boshqaruv Asboblari (Zoom Slider, Rotate, Reset) */}
        <div className="p-4 sm:p-5 border-t border-border dark:border-white/10 space-y-3.5 bg-card">
          {/* Zoom slayderi va Burish/Reset tugmalari */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.6, Number((z - 0.1).toFixed(2))))}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer shrink-0"
              title={lang === 'ru' ? 'Уменьшить' : 'Kichiklashtirish'}
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            <input
              type="range"
              min="0.6"
              max="3"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="flex-1 accent-blue-600 h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
            />

            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(3, Number((z + 0.1).toFixed(2))))}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer shrink-0"
              title={lang === 'ru' ? 'Увеличить' : 'Kattalashtirish'}
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <span className="text-xs font-mono font-bold text-muted-foreground w-11 text-right shrink-0">
              {Math.round(zoom * 100)}%
            </span>

            {/* 90 gradus burish */}
            <button
              type="button"
              onClick={handleRotate}
              className="p-2 rounded-xl bg-secondary text-secondary-foreground hover:bg-muted font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer shrink-0"
              title={lang === 'ru' ? 'Повернуть на 90°' : "90° burish"}
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">90°</span>
            </button>

            {/* Qayta tiklash (Reset) */}
            <button
              type="button"
              onClick={handleReset}
              className="p-2 rounded-xl bg-secondary text-secondary-foreground hover:bg-muted font-bold text-xs transition-colors cursor-pointer shrink-0"
              title={lang === 'ru' ? 'Сброс' : 'Qayta tiklash'}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Tugmalar: Tasdiqlash va Bekor qilish */}
          <div className="flex items-center justify-end gap-2.5 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="px-4 py-2.5 rounded-xl bg-secondary text-secondary-foreground hover:bg-muted font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {lang === 'ru' ? 'Отмена' : 'Bekor qilish'}
            </button>

            <button
              type="button"
              onClick={handleCrop}
              disabled={isProcessing}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-lg shadow-blue-500/25 active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {isProcessing ? (
                <>
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>{lang === 'ru' ? 'Обработка...' : 'Qirqilmoqda...'}</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>
                    {lang === 'ru' ? 'Применить и сохранить' : 'Qirqish va Saqlash'}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
