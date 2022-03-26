import sqlite3
con = sqlite3.connect('dataBase.db')

cur = con.cursor()

def create_table(create_table_sql):
    cur.execute(create_table_sql)



def main():

    sql_create_competition_table = """ CREATE TABLE IF NOT EXISTS competition (
                                        idCompet integer PRIMARY KEY AUTOINCREMENT UNIQUE,
                                        typeSport integer NOT NULL,
                                        ownerIdSportif integer NOT NULL,
                                        begin_date text,
                                        city text,
                                        minAge integer NOT NULL,
                                        maxAge integer,
                                        registrationPrice real,
                                        beginHour text,
                                        FOREIGN KEY (typeSport) REFERENCES sports (idSport)
                                        FOREIGN KEY (ownerIdSportif) REFERENCES sportif (idSportif)
                                    ); """

    sql_create_sportif_table = """CREATE TABLE IF NOT EXISTS sportif (
                                    idSportif integer PRIMARY KEY AUTOINCREMENT UNIQUE,
                                    name text NOT NULL,
                                    surname text NOT NULL,
                                    age integer NOT NULL,
                                    city text NOT NULL,
                                    password text NOT NULL,
                                    email text NOT NULL UNIQUE,
                                    isAdmin integer
                                );"""

    sql_create_inscription_table = """CREATE TABLE IF NOT EXISTS inscription (
                                    idInscription integer PRIMARY KEY AUTOINCREMENT UNIQUE,
                                    sportif integer NOT NULL,
                                    compet integer NOT NULL,
                                    FOREIGN KEY (sportif) REFERENCES sportif (idSportif)
                                    FOREIGN KEY (compet) REFERENCES competition (idCompet)

                                );"""

    sql_create_news_table = """CREATE TABLE IF NOT EXISTS news (
                                    idNews integer PRIMARY KEY AUTOINCREMENT UNIQUE,
                                    ownerId integer NOT NULL,
                                    title text NOT NULL,
                                    subtitle text,
                                    contents text NOT NULL,
                                    publishingDate text NOT NULL,
                                    FOREIGN KEY (ownerId) REFERENCES sportif (idSportif)                                  
                                );"""

    sql_create_sports_table = """ CREATE TABLE IF NOT EXISTS sports (
                                    idSport integer PRIMARY KEY AUTOINCREMENT UNIQUE,
                                    sportName text NOT NULL,
                                    sportDescription text NOT NULL
                                );"""
                                


    # create tables
    if con is not None:
        # create competition table
        create_table(sql_create_competition_table)

        # create sportif table
        create_table(sql_create_sportif_table)

        # create inscription table
        create_table(sql_create_inscription_table)

        # create news table
        create_table(sql_create_news_table)

        # create sports table
        create_table(sql_create_sports_table)
    else:
        print("Error! cannot create the database connection.")


#endMain

if __name__ == '__main__':
    main()


# Save (commit) the changes
con.commit()

# We can also close the connection if we are done with it.
# Just be sure any changes have been committed or they will be lost.
con.close()