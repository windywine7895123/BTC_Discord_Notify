# Use official Bun image
FROM oven/bun:1

# Set working directory
WORKDIR /app

# Copy files
COPY . .

# Install dependencies
RUN bun install --production

# Expose your app port (if needed)
EXPOSE 3000

# Start the app
CMD ["bun", "run", "src/index.ts"]
