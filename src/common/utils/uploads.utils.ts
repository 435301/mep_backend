import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';

export const iconUploadConfig = (folder: string) => ({
    storage: diskStorage({
        destination: `./uploads/${folder}`,
        filename: (_, file, cb) => {
            const uniqueName = `${Date.now()}${extname(file.originalname)}`;
            cb(null, uniqueName);
        },
    }),
    fileFilter: (_, file, cb) => {
        if (!file.originalname.match(/\.(svg|png|jpg|jpeg|webp)$/i)) {
            return cb(
                new BadRequestException('Only SVG, PNG, JPG, JPEG, WebP icons are allowed'),
                false,
            );

        }
        cb(null, true);
    },
    limits: {
        fileSize: 200 * 1024, // 200 KB
    },
});
