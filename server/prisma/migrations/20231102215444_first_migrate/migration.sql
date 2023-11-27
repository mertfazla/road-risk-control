-- CreateTable
CREATE TABLE "Detected_Frames" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "category" INTEGER NOT NULL,
    "lng" REAL NOT NULL,
    "lat" REAL NOT NULL,
    "image_url" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
