# שלב 1: השתמש בגרסה יציבה של Node
FROM node:22.3.0

# שלב 2: הגדר תיקיית עבודה
WORKDIR /app

# שלב 3: התקן את תלויות השרת
COPY package*.json ./
RUN npm install

# שלב 4: העתק את שאר קבצי השרת
COPY . .

# שלב 5: התקן ובנה את הלקוח (Next.js) מתוך תת-תיקייה client/
WORKDIR /app/client
RUN npm install
RUN npm run build

# שלב 6: חזור לשרת
WORKDIR /app

# שלב 7: ודא שהשרת יאזין לפורט הרצוי
EXPOSE 3000

# שלב 8: הפעל את השרת (שימי לב אם זה index.js או server.js)
CMD ["node", "index.js"]
