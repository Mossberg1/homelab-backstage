# Use offical mkdocs image
FROM squidfunk/mkdocs-material:latest

# Install mkdocs plugins
RUN pip install --no-cache-dir \
	mkdocs-monorepo-plugin \
	mkdocs-techdocs-core

# Set working directory
WORKDIR /docs

# Copy everything from the catalog to the container
COPY . .

# Expose the documentation through port 8000
EXPOSE 8000
CMD ["serve", "--dev-addr", "0.0.0.0:8000"]


