from pypika import Query, Table, Parameter, Order
from pypika.functions import Now

episodes = Table("episodes")


def insert_episode_sql():
    # Use plain SQL for asyncpg compatibility
    return "INSERT INTO episodes (topic, persona, transcript) VALUES ($1, $2, $3) RETURNING *"


def select_episodes_sql(limit: int = 20):
    return Query.from_(episodes).select(episodes.star).orderby(episodes.timestamp, order=Order.desc).limit(limit)

