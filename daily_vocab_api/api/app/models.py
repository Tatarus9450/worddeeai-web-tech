from sqlalchemy import Column, Integer, String, Text, DECIMAL, TIMESTAMP, Enum as SQLEnum
from datetime import datetime, timezone, timedelta
from app.database import Base

# Thailand timezone (GMT+7)
TH_TZ = timezone(timedelta(hours=7))

def get_thailand_time():
    return datetime.now(TH_TZ)


class Word(Base):
    __tablename__ = "words"
    
    id = Column(Integer, primary_key=True, index=True)
    word = Column(String(100), unique=True, nullable=False)
    definition = Column(Text)
    difficulty_level = Column(
        SQLEnum('Beginner', 'Intermediate', 'Advanced', name='difficulty'),
        default='Beginner'
    )
    created_at = Column(TIMESTAMP, default=get_thailand_time)


class PracticeSession(Base):
    __tablename__ = "practice_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    word_id = Column(Integer, nullable=False)
    user_sentence = Column(Text, nullable=False)
    score = Column(DECIMAL(3, 1))
    feedback = Column(Text)
    corrected_sentence = Column(Text)
    practiced_at = Column(TIMESTAMP, default=get_thailand_time)

