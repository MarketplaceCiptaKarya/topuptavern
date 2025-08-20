// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { X } from 'lucide-react';
// import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';

// export interface MediaItem {
//     id?: string;
//     url: string;
//     file?: File;
// }

// interface PreviewMediaProps {
//     initialMedia?: MediaItem[];
//     onChange: (newMedia: File[], removedMedia: string[]) => void;
//     error?: string;
// }

// const PreviewMedia = forwardRef<HTMLInputElement, PreviewMediaProps>(({ error, initialMedia = [], onChange }, ref) => {
//     // State for current media items
//     const [media, setMedia] = useState<MediaItem[]>(initialMedia);

//     // Track initial state for change detection
//     const initialExistingIds = useRef<Set<string>>(new Set(initialMedia.filter((m) => m.id).map((m) => m.id!)));

//     // Store the previous media state for comparison
//     const prevMediaRef = useRef<MediaItem[]>(initialMedia);

//     // Handle media changes and report to parent
//     useEffect(() => {
//         if (prevMediaRef.current === media) return;

//         // Get current existing media IDs
//         const currentExistingIds = new Set(media.filter((m) => m.id).map((m) => m.id!));

//         // Calculate removed media (present in initial but not current)
//         const removed = Array.from(initialExistingIds.current).filter((id) => !currentExistingIds.has(id));

//         // Calculate new files (not present in initial)
//         const newFiles = media.filter((m) => !m.id).map((m) => m.file!);

//         // Report changes to parent
//         if (removed.length > 0 || newFiles.length > 0) {
//             onChange(newFiles, removed);
//         }

//         // Update previous media reference
//         prevMediaRef.current = media;
//     }, [media, onChange]);

//     // Cleanup object URLs on unmount
//     useEffect(() => {
//         const currentMedia = media;

//         return () => {
//             currentMedia.forEach((item) => {
//                 if (!item.id && item.url.startsWith('blob:')) {
//                     URL.revokeObjectURL(item.url);
//                 }
//             });
//         };
//     }, []);

//     // Handle file uploads
//     const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//         if (!e.target.files) return;

//         const newFiles = Array.from(e.target.files).map((file) => ({
//             url: URL.createObjectURL(file),
//             file,
//         }));

//         setMedia((prev) => [...prev, ...newFiles]);
//         e.target.value = ''; // Reset input
//     };

//     // Handle media removal
// const handleRemove = useCallback((item: MediaItem) => {
//     setMedia((prev) => {
//         const newMedia = prev.filter((m) => (m.id ? m.id !== item.id : m.url !== item.url));

//         // Cleanup object URL for new files
//         if (!item.id) {
//             URL.revokeObjectURL(item.url);
//         }

//         return newMedia;
//     });
// }, []);

//     return (
//         <>
//             <Label className="grid w-full max-w-lg items-center gap-3">
//                 Media
//                 <Input type="file" accept="image/*" multiple ref={ref} onChange={handleFileUpload} />
//             </Label>
//             {error && <p className="text-sm text-red-500">{error}</p>}
//             <div className="flex h-96 w-full flex-wrap gap-5 overflow-y-auto rounded border border-dashed p-5 shadow">
//                 {media.map((item, index) => (
//                     <div
//                         key={item.id + '-' + index}
//                         className={`relative flex size-32 items-center justify-center rounded border-2 bg-gray-100 p-0.5`}
//                     >
//                         <img src={item.url} className="h-full w-full object-contain" alt={`Preview ${item.id}`} />
//                         <button
//                             type="button"
//                             className="absolute top-0 right-0 inline-flex size-6 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-red-500 text-white transition-colors hover:bg-red-600"
//                             onClick={() => handleRemove(item)}
//                             aria-label={`Remove image ${item.id}`}
//                         >
//                             <X className="size-4" />
//                         </button>
//                     </div>
//                 ))}

//                 {media.length === 0 && <div className="flex h-full w-full items-center justify-center text-gray-500">No images added yet</div>}
//             </div>
//         </>
//     );
// });
// PreviewMedia.displayName = 'PreviewMedia';
// export default PreviewMedia;

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';

export interface MediaItem {
    id?: string;
    url: string;
    file?: File;
}

interface PreviewMediaProps {
    initialMedia?: MediaItem | null;
    onChange: (newFile: File | null, removedId?: string) => void;
    error?: string;
}

const PreviewMedia = forwardRef<HTMLInputElement, PreviewMediaProps>(
    ({ error, initialMedia = null, onChange }, ref) => {
        const [media, setMedia] = useState<MediaItem | null>(initialMedia);

        const prevMediaRef = useRef<MediaItem | null>(initialMedia);

        // Handle media changes
        useEffect(() => {
            if (prevMediaRef.current === media) return;

            if (media && !media.id && media.file) {
                // New file uploaded
                onChange(media.file);
            } else if (!media && prevMediaRef.current) {
                // File removed
                onChange(null, prevMediaRef.current.id);
            }

            prevMediaRef.current = media;
        }, [media, onChange]);

        // Cleanup object URLs
        useEffect(() => {
            return () => {
                if (media && !media.id && media.url.startsWith('blob:')) {
                    URL.revokeObjectURL(media.url);
                }
            };
        }, [media]);

        // Handle file upload (only one allowed)
        const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (!e.target.files || e.target.files.length === 0) return;

            const file = e.target.files[0];
            const newMedia: MediaItem = {
                url: URL.createObjectURL(file),
                file,
            };

            // Cleanup old blob URL if exists
            if (media && !media.id && media.url.startsWith('blob:')) {
                URL.revokeObjectURL(media.url);
            }

            setMedia(newMedia);
            e.target.value = ''; // Reset input
        };

        // Handle remove
        const handleRemove = useCallback(() => {
            if (media && !media.id && media.url.startsWith('blob:')) {
                URL.revokeObjectURL(media.url);
            }
            setMedia(null);
        }, [media]);

        return (
            <div className="flex flex-col gap-2">
                <Label className="w-full max-w-lg">
                    Logo
                    <Input
                        type="file"
                        accept="image/*"
                        ref={ref}
                        onChange={handleFileUpload}
                        className="mt-1"
                    />
                </Label>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <div className="flex flex-wrap gap-4">
                    {media ? (
                        <div className="relative size-32 rounded border p-1 bg-gray-100">
                            <img
                                src={media.url}
                                alt="Preview"
                                className="h-full w-full object-contain rounded"
                            />
                            <button
                                type="button"
                                className="absolute top-0 right-0 inline-flex size-6 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                                onClick={handleRemove}
                                aria-label="Remove image"
                            >
                                <X className="size-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex h-32 w-32 items-center justify-center border border-dashed text-gray-400 rounded">
                            No image
                        </div>
                    )}
                </div>
            </div>
        );
    }
);

PreviewMedia.displayName = 'PreviewMedia';
export default PreviewMedia;
