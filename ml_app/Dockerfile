# Use a lightweight Python image
FROM python:3.12-slim

# Set the working directory
WORKDIR /app

# Copy dependencies and install them
COPY requirements.txt .
RUN pip install --default-timeout=1000 --no-cache-dir -r requirements.txt

# Copy your ML model and application code
COPY . .

# Railway dynamically assigns the PORT environment variable.
# We use uvicorn to run the FastAPI app, binding to 0.0.0.0 and the Railway PORT.
CMD ["sh", "-c", "uvicorn app:app --host 0.0.0.0 --port ${PORT:-8000}"]
