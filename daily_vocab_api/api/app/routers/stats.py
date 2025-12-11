from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, text
from typing import List
from datetime import datetime, timedelta, timezone

from app.database import get_db
from app.models import Word, PracticeSession
from app.schemas import SummaryResponse, HistoryItem

router = APIRouter()


@router.get("/dashboard-stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    """Get dashboard statistics: day streak and total learning time"""
    
    # Thailand timezone (GMT+7)
    TH_TZ = timezone(timedelta(hours=7))
    today = datetime.now(TH_TZ).date()
    
    # Get all practice dates (distinct days) using DATE() function on practiced_at
    # Note: practiced_at in DB might be UTC or Local depending on how it was saved. 
    # Current setup saves as Thailand Time (after recent fix), but old data might be UTC.
    # We will cast to date.
    practices = db.query(
        func.date(PracticeSession.practiced_at).label('practice_date')
    ).distinct().order_by(text('practice_date DESC')).all()
    
    streak_dates = [p.practice_date for p in practices]
    print(f"DEBUG: Today (TH): {today}")
    print(f"DEBUG: Practice Dates: {streak_dates}")
    
    # Calculate day streak
    day_streak = 0
    if streak_dates:
        # Check if practiced today or yesterday to start counting
        if streak_dates[0] == today or streak_dates[0] == today - timedelta(days=1):
            day_streak = 1
            current_date = streak_dates[0]
            
            for i in range(1, len(streak_dates)):
                if streak_dates[i] == current_date - timedelta(days=1):
                    day_streak += 1
                    current_date = streak_dates[i]
                else:
                    break
    
    # Total learning time (1 word = 1 minute)
    total_practices = db.query(func.count(PracticeSession.id)).scalar() or 0
    total_minutes = total_practices  # 1 practice = 1 minute
    
    hours = total_minutes // 60
    minutes = total_minutes % 60
    
    # Check if practiced today
    practiced_today = False
    if streak_dates and streak_dates[0] == today:
        practiced_today = True

    return {
        "day_streak": day_streak,
        "total_minutes": total_minutes,
        "hours": hours,
        "minutes": minutes,
        "time_display": f"{hours}h {minutes}m" if hours > 0 else f"{minutes}m",
        "practiced_today": practiced_today
    }


@router.get("/practice-history")
def get_practice_history(limit: int = 50, db: Session = Depends(get_db)):
    """Get practice history with word details"""
    
    # Join practice_sessions with words to get word and difficulty_level
    query = text("""
        SELECT 
            ps.id,
            w.word,
            w.difficulty_level,
            ps.score,
            ps.user_sentence,
            ps.feedback,
            ps.practiced_at
        FROM practice_sessions ps
        JOIN words w ON ps.word_id = w.id
        ORDER BY ps.practiced_at DESC
        LIMIT :limit
    """)
    
    result = db.execute(query, {"limit": limit})
    
    history = []
    for row in result:
        history.append({
            "id": row[0],
            "word": row[1],
            "difficulty_level": row[2],
            "score": float(row[3]) if row[3] else 0.0,
            "user_sentence": row[4],
            "feedback": row[5],
            "practiced_at": row[6].isoformat() if row[6] else None
        })
    
    return history


@router.get("/summary", response_model=SummaryResponse)
def get_summary(db: Session = Depends(get_db)):
    """Get overall practice statistics"""
    
    total_practices = db.query(func.count(PracticeSession.id)).scalar() or 0
    avg_score = db.query(func.avg(PracticeSession.score)).scalar() or 0.0
    total_words = db.query(func.count(func.distinct(PracticeSession.word_id))).scalar() or 0
    
    # Level distribution
    level_dist = db.query(
        Word.difficulty_level,
        func.count(PracticeSession.id)
    ).join(PracticeSession, Word.id == PracticeSession.word_id
    ).group_by(Word.difficulty_level).all()
    
    distribution = {level: count for level, count in level_dist}
    
    return SummaryResponse(
        total_practices=total_practices,
        average_score=round(float(avg_score), 1),
        total_words_practiced=total_words,
        level_distribution=distribution
    )


@router.get("/history", response_model=List[HistoryItem])
def get_history(limit: int = 10, db: Session = Depends(get_db)):
    """Get last N practice sessions"""
    
    query = text("""
        SELECT 
            ps.id,
            w.word,
            ps.user_sentence,
            ps.score,
            ps.feedback,
            ps.practiced_at
        FROM practice_sessions ps
        JOIN words w ON ps.word_id = w.id
        ORDER BY ps.practiced_at DESC
        LIMIT :limit
    """)
    
    result = db.execute(query, {"limit": limit})
    
    history = []
    for row in result:
        history.append(HistoryItem(
            id=row[0],
            word=row[1],
            user_sentence=row[2],
            score=float(row[3]) if row[3] else 0.0,
            feedback=row[4] or "",
            practiced_at=row[5]
        ))
    
    return history