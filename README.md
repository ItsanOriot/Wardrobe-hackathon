# AI Stylist - Personal Wardrobe Assistant

A full-stack application that helps users organize their wardrobe and get AI-powered styling advice. Users can scan clothing items using computer vision, manage their wardrobe, and chat with an AI stylist for outfit recommendations.

## Features

- **Authentication**: Secure email/password authentication with Supabase
- **AI Scanner**: Upload clothing photos and automatically extract metadata using GPT-4o Vision
- **Wardrobe Management**: Store up to 100 clothing items with filters by color, warmth, and formality
- **AI Stylist Chat**: Get personalized outfit suggestions based on your wardrobe
- **Clean UI**: Minimalist design with a beige color scheme

## Tech Stack

### Frontend
- **Next.js 15** with TypeScript
- **Tailwind CSS** for styling
- **Supabase Client** for authentication

### Backend
- **FastAPI** (Python)
- **OpenAI GPT-4o** for vision and chat
- **Supabase** (PostgreSQL + Storage)
- **Pillow** for image processing

## Project Structure

```
leif/
├── frontend/               # Next.js frontend
│   ├── app/
│   │   ├── page.tsx       # Main chat page
│   │   ├── login/         # Authentication page
│   │   └── wardrobe/      # Wardrobe grid page
│   ├── components/        # React components
│   └── lib/               # API clients and utilities
│
├── backend/               # FastAPI backend
│   ├── app/
│   │   ├── routers/       # API endpoints
│   │   ├── services/      # Business logic
│   │   ├── models/        # Pydantic schemas
│   │   ├── prompts.py     # AI system prompts
│   │   └── main.py        # FastAPI app
│   └── supabase_setup.sql # Database schema
│
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+
- Supabase account
- OpenAI API account

### 1. Supabase Setup

1. Create a new Supabase project at https://supabase.com
2. Run the SQL in `backend/supabase_setup.sql` in the SQL Editor
3. Create a storage bucket:
   - Go to Storage → Create bucket
   - Name: `wardrobe-images`
   - Set to **Public**
4. Add storage policy for uploads:
   - Policy name: "Users can upload their own images"
   - Policy: `(bucket_id = 'wardrobe-images' AND (storage.foldername(name))[1] = auth.uid()::text)`

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
```

Edit `.env` with your credentials:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
OPENAI_API_KEY=sk-your-openai-key
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 4. Running the Application

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Access the application at http://localhost:3000

## Usage

1. **Sign Up**: Create an account on the login page
2. **Add Clothes**: Click the camera icon to upload clothing photos
3. **Review Scan**: Check the AI-extracted details and add to wardrobe
4. **Manage Wardrobe**: View and edit items in the wardrobe page (accessible via dropdown menu)
5. **Chat with AI**: Ask the stylist for outfit suggestions, color advice, or styling tips

## Environment Variables

### Frontend (.env.local)
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key
- `NEXT_PUBLIC_API_URL`: Backend API URL (default: http://localhost:8000)

### Backend (.env)
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_SERVICE_KEY`: Supabase service role key (for admin operations)
- `OPENAI_API_KEY`: Your OpenAI API key

## API Endpoints

### Authentication
- `POST /auth/signup` - Create account
- `POST /auth/login` - Sign in
- `POST /auth/logout` - Sign out
- `GET /auth/me` - Get current user

### Scanner
- `POST /scan/` - Scan clothing image (multipart/form-data)

### Wardrobe
- `GET /wardrobe/` - Get all items (with optional filters)
- `POST /wardrobe/` - Create new item
- `PUT /wardrobe/{item_id}` - Update item
- `DELETE /wardrobe/{item_id}` - Delete item

### Chat
- `POST /chat/` - Send message to AI stylist
- `POST /chat/clear` - Clear chat history

## Customization

### Modifying AI Prompts
Edit `backend/app/prompts.py` to customize:
- Scanner vision analysis behavior
- AI stylist personality and guidelines
- Wardrobe context formatting

### Color Scheme
The app uses a beige palette defined in `frontend/tailwind.config.ts`:
- `#E4DDCD` (beige-lightest)
- `#D4C4B0` (beige-light)
- `#C3A27C` (beige)
- `#A98862` (beige-dark)

## Database Schema

### wardrobe_items
- `id` (UUID) - Primary key
- `user_id` (UUID) - Foreign key to auth.users
- `title` (VARCHAR) - Item name
- `description` (VARCHAR) - Item description
- `color` (ENUM) - One of 11 predefined colors
- `warmth` (ENUM) - Cold/Cool/Neutral/Warm/Hot
- `formality` (INTEGER 1-10) - Formality rating
- `image_url` (TEXT) - Supabase storage URL
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Troubleshooting

### "Invalid token" errors
- Check that your Supabase credentials are correct
- Verify the service role key is used in the backend
- Ensure the anon key is used in the frontend

### Image upload fails
- Verify the storage bucket exists and is public
- Check storage policies allow user uploads
- Ensure images are under 2MB

### AI responses are empty
- Verify your OpenAI API key has credits
- Check the backend logs for detailed error messages
- Ensure you're using GPT-4o (not GPT-3.5)

## License

MIT

## Support

For issues or questions, please check the documentation or create an issue in the repository.
