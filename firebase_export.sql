-- Firebase Export to SQL
-- Extracted 10 records

CREATE TABLE IF NOT EXISTS transactions (
  id VARCHAR(255) PRIMARY KEY,
  date VARCHAR(20),
  type VARCHAR(50),
  category VARCHAR(100),
  amount INTEGER,
  who VARCHAR(50),
  payment VARCHAR(50),
  memo TEXT
);

INSERT INTO transactions (id, date, type, category, amount, who, payment, memo) VALUES ('6miF7yyI19NxifbiEKlD', '2026-04-25', 'expense', '구독', 17000, 'husband', '신용카드', '넷플릭스');
INSERT INTO transactions (id, date, type, category, amount, who, payment, memo) VALUES ('8gLWjKsK2Niyt0glVURn', '2026-04-27', 'income', '급여', 300000, 'husband', '신용카드', '');
INSERT INTO transactions (id, date, type, category, amount, who, payment, memo) VALUES ('B6oBowmH2FzzVXZfQPcc', '2026-03-04', 'expense', '주거', 2555588, 'shared', '신용카드', '');
INSERT INTO transactions (id, date, type, category, amount, who, payment, memo) VALUES ('VFdChZsXzWccu0mC9BoR', '2026-04-07', 'expense', '자동차', 222222, 'husband', '신용카드', '');
INSERT INTO transactions (id, date, type, category, amount, who, payment, memo) VALUES ('ZawCrCSjYobQeehguOZS', '2026-04-20', 'expense', '문화생활', 20000, 'husband', '신용카드', '헿');
INSERT INTO transactions (id, date, type, category, amount, who, payment, memo) VALUES ('e6p2iFHCvbtcSNWl2r9D', '2026-04-07', 'income', '급여', 5000000, 'husband', '계좌이체', '');
INSERT INTO transactions (id, date, type, category, amount, who, payment, memo) VALUES ('lRIFwpA3GjECavqwdyeF', '2026-04-07', 'expense', '통신비', 22000, 'wife', '계좌이체', '휴대폰 요금');
INSERT INTO transactions (id, date, type, category, amount, who, payment, memo) VALUES ('n15gqVTGV099ftcg4zyD', '2026-04-25', 'expense', '통신비', 75000, 'husband', '신용카드', '휴대폰 요금');
INSERT INTO transactions (id, date, type, category, amount, who, payment, memo) VALUES ('sa2QnC4vPoNveBWFX6yR', '2026-04-20', 'expense', '식비', 12000, 'wife', '체크카드', '점심(국밥)');
INSERT INTO transactions (id, date, type, category, amount, who, payment, memo) VALUES ('y9PRitJBSd9QAq5kECCa', '2026-04-25', 'expense', '주거', 120000, 'husband', '신용카드', '관리비');
