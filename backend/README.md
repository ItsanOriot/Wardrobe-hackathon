# StyleIt Backend API

FastAPI backend for the StyleIt wardrobe management application.

## Features

- User authentication via Supabase
- Wardrobe item management
- AI-powered clothing image scanning (OpenAI Vision)
- AI styling chat assistant (OpenAI GPT-4o)
- Image storage via Supabase Storage

## Tech Stack

- **Framework**: FastAPI
- **Database**: PostgreSQL (via Supabase)
- **Storage**: Supabase Storage
- **AI**: OpenAI GPT-4o and GPT-4o Vision
- **Authentication**: Supabase Auth

## Local Development

### Prerequisites

- Python 3.12+
- Supabase project
- OpenAI API key

### Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Update `.env` with your credentials:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_key
OPENAI_API_KEY=sk-your_key
FRONTEND_URL=http://localhost:3000
```

4. Set up database tables:
```bash
# Run the SQL in supabase_setup.sql in your Supabase SQL editor
```

5. Run the server:
```bash
python run_server.py
```

The API will be available at `http://localhost:8000`

### API Documentation

Once running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Deployment

### Render.com (Recommended)

1. Push code to GitHub
2. Create new Web Service on Render
3. Connect your repository
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables (see `.env.example`)
6. Deploy

Alternatively, use the included `render.yaml` for Blueprint deployment.

### Railway.app

1. Create new project
2. Connect GitHub repository
3. Set root directory to `backend`
4. Add environment variables
5. Deploy

### Fly.io

1. Install Fly CLI
2. Create `Dockerfile` in backend directory
3. Run `fly launch`
4. Set environment variables: `fly secrets set KEY=value`
5. Deploy: `fly deploy`

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SUPABASE_URL` | Your Supabase project URL | Yes |
| `SUPABASE_SERVICE_KEY` | Supabase service role key | Yes |
| `OPENAI_API_KEY` | OpenAI API key | Yes |
| `FRONTEND_URL` | Frontend URL for CORS | Yes (production) |

## API Endpoints

### Authentication
- `POST /auth/signup` - Create new account
- `POST /auth/login` - Login

### Wardrobe
- `GET /wardrobe` - Get all items
- `POST /wardrobe` - Create item
- `PUT /wardrobe/{id}` - Update item
- `DELETE /wardrobe/{id}` - Delete item

### Scan
- `POST /scan` - Scan clothing image with AI

### Chat
- `POST /chat` - Send message to AI stylist
- `GET /chat/history` - Get chat history

### Health
- `GET /health` - Health check endpoint

## Project Structure

```
backend/
├── app/
│   ├── routers/
│   │   ├── auth.py       # Authentication endpoints
│   │   ├── wardrobe.py   # Wardrobe management
│   │   ├── scan.py       # Image scanning
│   │   └── chat.py       # AI chat
│   ├── services/
│   │   ├── supabase.py   # Supabase client
│   │   └── openai_service.py  # OpenAI integration
│   └── main.py           # FastAPI app
├── requirements.txt      # Python dependencies
├── render.yaml          # Render deployment config
└── run_server.py        # Local development server
```

## Testing

Run tests:
```bash
# Test authentication
python test_auth.py

# Test wardrobe creation
python test_wardrobe_creation.py

# Test chat with images
python test_chat_with_images.py

# Test OpenAI response
python test_openai_response.py
```

## Troubleshooting

### CORS errors
- Ensure `FRONTEND_URL` environment variable is set correctly
- Check that frontend URL matches exactly (including protocol)

### Database errors
- Verify Supabase tables are created (run `supabase_setup.sql`)
- Check RLS policies allow service role access

### OpenAI errors
- Verify API key is valid
- Check OpenAI account has credits
- Ensure you have access to GPT-4o models

### Image upload errors
- Verify Supabase storage bucket `wardrobe-images` exists
- Check bucket permissions (should be public or have RLS policies)

## License

MIT

