/**
 * Image Optimization Script
 * Compresses images in public/assets to WebP format for better performance
 * Run with: node scripts/optimize-images.mjs
 */

import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ASSETS_DIR = path.join(__dirname, '..', 'public', 'assets');
const QUALITY = 80; // WebP quality (0-100)
const MAX_WIDTH = 1920; // Max width for backgrounds
const MAX_WIDTH_SMALL = 800; // For cars/drivers

// Folders and their max dimensions
const FOLDER_CONFIG = {
    'backgrounds': { maxWidth: 1920, quality: 75 },
    'heroes': { maxWidth: 1920, quality: 75 },
    'cars': { maxWidth: 600, quality: 85 },
    'drivers': { maxWidth: 400, quality: 85 },
    'circuits': { maxWidth: 1200, quality: 80 },
    'logos': { maxWidth: 300, quality: 90 }
};

let totalOriginalSize = 0;
let totalOptimizedSize = 0;
let processedCount = 0;

async function optimizeImage(filePath, config) {
    try {
        const ext = path.extname(filePath).toLowerCase();
        if (!['.png', '.jpg', '.jpeg'].includes(ext)) return;

        const stats = await fs.stat(filePath);
        totalOriginalSize += stats.size;

        const webpPath = filePath.replace(/\.(png|jpg|jpeg)$/i, '.webp');

        // Check if already optimized
        try {
            const webpStats = await fs.stat(webpPath);
            if (webpStats.mtimeMs > stats.mtimeMs) {
                console.log(`⏭️  Skip (already optimized): ${path.basename(filePath)}`);
                return;
            }
        } catch { }

        await sharp(filePath)
            .resize(config.maxWidth, null, {
                withoutEnlargement: true,
                fit: 'inside'
            })
            .webp({ quality: config.quality })
            .toFile(webpPath);

        const newStats = await fs.stat(webpPath);
        totalOptimizedSize += newStats.size;
        processedCount++;

        const savings = ((1 - newStats.size / stats.size) * 100).toFixed(1);
        console.log(`✅ ${path.basename(filePath)} → ${path.basename(webpPath)} (${savings}% smaller)`);
    } catch (error) {
        console.error(`❌ Error processing ${filePath}: ${error.message}`);
    }
}

async function processDirectory(dirPath, config) {
    try {
        const entries = await fs.readdir(dirPath, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dirPath, entry.name);

            if (entry.isDirectory()) {
                const folderConfig = FOLDER_CONFIG[entry.name] || config;
                await processDirectory(fullPath, folderConfig);
            } else if (entry.isFile()) {
                await optimizeImage(fullPath, config);
            }
        }
    } catch (error) {
        console.error(`Error reading directory ${dirPath}: ${error.message}`);
    }
}

async function main() {
    console.log('🏎️  F1 Image Optimization Script');
    console.log('================================\n');

    const startTime = Date.now();

    await processDirectory(ASSETS_DIR, { maxWidth: 1920, quality: 80 });

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    const savedMB = ((totalOriginalSize - totalOptimizedSize) / (1024 * 1024)).toFixed(2);

    console.log('\n================================');
    console.log(`✅ Processed ${processedCount} images`);
    console.log(`💾 Total savings: ${savedMB} MB`);
    console.log(`⏱️  Time: ${elapsed}s`);
    console.log('================================\n');
    console.log('💡 Update your code to use .webp extensions for optimized loading!');
}

main();
