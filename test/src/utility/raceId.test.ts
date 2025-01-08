import {
    AutoracePlaceIdSchema,
    AutoraceRaceIdSchema,
    AutoraceRacePlayerIdSchema,
    BoatracePlaceIdSchema,
    BoatraceRaceIdSchema,
    BoatraceRacePlayerIdSchema,
    JraPlaceIdSchema,
    JraRaceIdSchema,
    KeirinPlaceIdSchema,
    KeirinRaceIdSchema,
    KeirinRacePlayerIdSchema,
    NarPlaceIdSchema,
    NarRaceIdSchema,
    WorldPlaceIdSchema,
    WorldRaceIdSchema,
} from '../../../lib/src/utility/raceId';

describe('JraPlaceIdSchema', () => {
    it('正しいJraPlaceId', () => {
        const validJraPlaceId = 'jra2021080101';
        const result = JraPlaceIdSchema.safeParse(validJraPlaceId);
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data).toBe(validJraPlaceId);
        }
    });

    it('不正なJraPlaceId', () => {
        const invalidJraPlaceIdAndMessage = [
            ['abc2021080101', 'jraから始まる必要があります'],
            ['2021jra080101', 'jraから始まる必要があります'],
            ['jra202108010', 'JraPlaceIdの形式ではありません'],
            ['nar2021080101', 'jraから始まる必要があります'],
        ];
        invalidJraPlaceIdAndMessage.forEach(([invalidId, message]) => {
            const result = JraPlaceIdSchema.safeParse(invalidId);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe(message);
            }
        });
    });
});

describe('JraRaceIdSchema', () => {
    it('正しいJraRaceId', () => {
        const validJraRaceId = 'jra202108010101';
        const result = JraRaceIdSchema.safeParse(validJraRaceId);
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data).toBe(validJraRaceId);
        }
    });

    it('不正なJraRaceId', () => {
        const invalidJraRaceIdAndMessage = [
            ['jraabc2021080101', 'JraRaceIdの形式ではありません'],
            ['jra2021jra080101', 'JraRaceIdの形式ではありません'],
            ['jra202108010', 'JraRaceIdの形式ではありません'],
            ['nar202108010101', 'jraから始まる必要があります'],
            ['jra202108010113', 'レース番号は1~12の範囲である必要があります'],
        ];
        invalidJraRaceIdAndMessage.forEach(([invalidId, message]) => {
            const result = JraRaceIdSchema.safeParse(invalidId);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe(message);
            }
        });
    });
});

describe('NarPlaceIdSchema', () => {
    it('正しいNarPlaceId', () => {
        const validNarPlaceId = 'nar2021080101';
        const result = NarPlaceIdSchema.safeParse(validNarPlaceId);
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data).toBe(validNarPlaceId);
        }
    });

    it('不正なNarPlaceId', () => {
        const invalidNarPlaceIdAndMessage = [
            ['abc2021080101', 'narから始まる必要があります'],
            ['2021nar080101', 'narから始まる必要があります'],
            ['nar202108010', 'NarPlaceIdの形式ではありません'],
            ['jra2021080101', 'narから始まる必要があります'],
        ];
        invalidNarPlaceIdAndMessage.forEach(([invalidId, message]) => {
            const result = NarPlaceIdSchema.safeParse(invalidId);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe(message);
            }
        });
    });
});

describe('NarRaceIdSchema', () => {
    it('正しいNarRaceId', () => {
        const validNarRaceId = 'nar202108010101';
        const result = NarRaceIdSchema.safeParse(validNarRaceId);
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data).toBe(validNarRaceId);
        }
    });

    it('不正なNarRaceId', () => {
        const invalidNarRaceIdAndMessage = [
            ['narabc2021080101', 'NarRaceIdの形式ではありません'],
            ['nar2021nar080101', 'NarRaceIdの形式ではありません'],
            ['nar202108010', 'NarRaceIdの形式ではありません'],
            ['jra202108010101', 'narから始まる必要があります'],
            ['nar202108010113', 'レース番号は1~12の範囲である必要があります'],
        ];
        invalidNarRaceIdAndMessage.forEach(([invalidId, message]) => {
            const result = NarRaceIdSchema.safeParse(invalidId);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe(message);
            }
        });
    });
});

describe('WorldPlaceIdSchema', () => {
    it('正しいWorldPlaceId', () => {
        const validWorldPlaceId = 'world2021080101';
        const result = WorldPlaceIdSchema.safeParse(validWorldPlaceId);
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data).toBe(validWorldPlaceId);
        }
    });

    it('不正なWorldPlaceId', () => {
        const invalidWorldPlaceIdAndMessage = [
            ['abc2021080101', 'worldから始まる必要があります'],
            ['2021world080101', 'worldから始まる必要があります'],
            ['world202108010', 'WorldPlaceIdの形式ではありません'],
            ['jra2021080101', 'worldから始まる必要があります'],
        ];
        invalidWorldPlaceIdAndMessage.forEach(([invalidId, message]) => {
            const result = WorldPlaceIdSchema.safeParse(invalidId);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe(message);
            }
        });
    });
});

describe('WorldRaceIdSchema', () => {
    it('正しいWorldRaceId', () => {
        const validWorldRaceId = 'world202108010101';
        const result = WorldRaceIdSchema.safeParse(validWorldRaceId);
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data).toBe(validWorldRaceId);
        }
    });

    it('不正なWorldRaceId', () => {
        const invalidWorldRaceIdAndMessage = [
            ['worldabc2021080101', 'WorldRaceIdの形式ではありません'],
            ['world2021world080101', 'WorldRaceIdの形式ではありません'],
            ['world202108010', 'WorldRaceIdの形式ではありません'],
            ['jra202108010101', 'worldから始まる必要があります'],
        ];
        invalidWorldRaceIdAndMessage.forEach(([invalidId, message]) => {
            const result = WorldRaceIdSchema.safeParse(invalidId);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe(message);
            }
        });
    });
});

describe('KeirinPlaceIdSchema', () => {
    it('正しいKeirinPlaceId', () => {
        const validKeirinPlaceId = 'keirin2021080101';
        const result = KeirinPlaceIdSchema.safeParse(validKeirinPlaceId);
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data).toBe(validKeirinPlaceId);
        }
    });

    it('不正なKeirinPlaceId', () => {
        const invalidKeirinPlaceIdAndMessage = [
            ['abc2021080101', 'keirinから始まる必要があります'],
            ['2021keirin080101', 'keirinから始まる必要があります'],
            ['keirin202108010', 'KeirinPlaceIdの形式ではありません'],
            ['jra2021080101', 'keirinから始まる必要があります'],
        ];
        invalidKeirinPlaceIdAndMessage.forEach(([invalidId, message]) => {
            const result = KeirinPlaceIdSchema.safeParse(invalidId);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe(message);
            }
        });
    });
});

describe('KeirinRaceIdSchema', () => {
    it('正しいKeirinRaceId', () => {
        const validKeirinRaceId = 'keirin202108010101';
        const result = KeirinRaceIdSchema.safeParse(validKeirinRaceId);
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data).toBe(validKeirinRaceId);
        }
    });

    it('不正なKeirinRaceId', () => {
        const invalidKeirinRaceIdAndMessage = [
            ['keirinabc2021080101', 'KeirinRaceIdの形式ではありません'],
            ['keirin2021keirin080101', 'KeirinRaceIdの形式ではありません'],
            ['keirin202108010', 'KeirinRaceIdの形式ではありません'],
            ['jra202108010101', 'keirinから始まる必要があります'],
            [
                'keirin202108010113',
                'レース番号は1~12の範囲である必要があります',
            ],
        ];
        invalidKeirinRaceIdAndMessage.forEach(([invalidId, message]) => {
            const result = KeirinRaceIdSchema.safeParse(invalidId);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe(message);
            }
        });
    });
});

describe('KeirinRacePlayerIdSchema', () => {
    it('正しいKeirinRacePlayerId', () => {
        const validKeirinRacePlayerId = 'keirin20210801010101';
        const result = KeirinRacePlayerIdSchema.safeParse(
            validKeirinRacePlayerId,
        );
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data).toBe(validKeirinRacePlayerId);
        }
    });

    it('不正なKeirinRacePlayerId', () => {
        const invalidKeirinRacePlayerIdAndMessage = [
            ['keirinabc202108010101', 'KeirinRacePlayerIdの形式ではありません'],
            [
                'keirin2021keirin08010101',
                'KeirinRacePlayerIdの形式ではありません',
            ],
            ['keirin202108010101', 'KeirinRacePlayerIdの形式ではありません'],
            ['jra20210801010101', 'keirinから始まる必要があります'],
            ['keirin20210801010113', '枠番は1~9の範囲である必要があります'],
        ];
        invalidKeirinRacePlayerIdAndMessage.forEach(([invalidId, message]) => {
            const result = KeirinRacePlayerIdSchema.safeParse(invalidId);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe(message);
            }
        });
    });
});

describe('BoatracePlaceIdSchema', () => {
    it('正しいBoatracePlaceId', () => {
        const validBoatracePlaceId = 'boatrace2021080101';
        const result = BoatracePlaceIdSchema.safeParse(validBoatracePlaceId);
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data).toBe(validBoatracePlaceId);
        }
    });

    it('不正なBoatracePlaceId', () => {
        const invalidBoatracePlaceIdAndMessage = [
            ['abc2021080101', 'boatraceから始まる必要があります'],
            ['2021boatrace080101', 'boatraceから始まる必要があります'],
            ['boatrace202108010', 'BoatracePlaceIdの形式ではありません'],
            ['jra2021080101', 'boatraceから始まる必要があります'],
        ];
        invalidBoatracePlaceIdAndMessage.forEach(([invalidId, message]) => {
            const result = BoatracePlaceIdSchema.safeParse(invalidId);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe(message);
            }
        });
    });
});

describe('BoatraceRaceIdSchema', () => {
    it('正しいBoatraceRaceId', () => {
        const validBoatraceRaceId = 'boatrace202108010101';
        const result = BoatraceRaceIdSchema.safeParse(validBoatraceRaceId);
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data).toBe(validBoatraceRaceId);
        }
    });

    it('不正なBoatraceRaceId', () => {
        const invalidBoatraceRaceIdAndMessage = [
            ['boatraceabc2021080101', 'BoatraceRaceIdの形式ではありません'],
            [
                'boatrace2021boatrace080101',
                'BoatraceRaceIdの形式ではありません',
            ],
            ['boatrace202108010', 'BoatraceRaceIdの形式ではありません'],
            ['jra202108010101', 'boatraceから始まる必要があります'],
            [
                'boatrace202108010113',
                'レース番号は1~12の範囲である必要があります',
            ],
        ];
        invalidBoatraceRaceIdAndMessage.forEach(([invalidId, message]) => {
            const result = BoatraceRaceIdSchema.safeParse(invalidId);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe(message);
            }
        });
    });
});

describe('BoatraceRacePlayerIdSchema', () => {
    it('正しいBoatraceRacePlayerId', () => {
        const validBoatraceRacePlayerId = 'boatrace20210801010101';
        const result = BoatraceRacePlayerIdSchema.safeParse(
            validBoatraceRacePlayerId,
        );
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data).toBe(validBoatraceRacePlayerId);
        }
    });

    it('不正なBoatraceRacePlayerId', () => {
        const invalidBoatraceRacePlayerIdAndMessage = [
            [
                'boatraceabc202108010101',
                'BoatraceRacePlayerIdの形式ではありません',
            ],
            [
                'boatrace2021boatrace08010101',
                'BoatraceRacePlayerIdの形式ではありません',
            ],
            [
                'boatrace202108010101',
                'BoatraceRacePlayerIdの形式ではありません',
            ],
            ['jra20210801010101', 'boatraceから始まる必要があります'],
            ['boatrace20210801010113', '枠番は1~6の範囲である必要があります'],
        ];
        invalidBoatraceRacePlayerIdAndMessage.forEach(
            ([invalidId, message]) => {
                const result = BoatraceRacePlayerIdSchema.safeParse(invalidId);
                expect(result.success).toBe(false);
                if (!result.success) {
                    expect(result.error.issues[0].message).toBe(message);
                }
            },
        );
    });
});

describe('AutoracePlaceIdSchema', () => {
    it('正しいAutoracePlaceId', () => {
        const validAutoracePlaceId = 'autorace2021080101';
        const result = AutoracePlaceIdSchema.safeParse(validAutoracePlaceId);
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data).toBe(validAutoracePlaceId);
        }
    });

    it('不正なAutoracePlaceId', () => {
        const invalidAutoracePlaceIdAndMessage = [
            ['abc2021080101', 'autoraceから始まる必要があります'],
            ['2021autorace080101', 'autoraceから始まる必要があります'],
            ['autorace202108010', 'AutoracePlaceIdの形式ではありません'],
            ['jra2021080101', 'autoraceから始まる必要があります'],
        ];
        invalidAutoracePlaceIdAndMessage.forEach(([invalidId, message]) => {
            const result = AutoracePlaceIdSchema.safeParse(invalidId);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe(message);
            }
        });
    });
});

describe('AutoraceRaceIdSchema', () => {
    it('正しいAutoraceRaceId', () => {
        const validAutoraceRaceId = 'autorace202108010101';
        const result = AutoraceRaceIdSchema.safeParse(validAutoraceRaceId);
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data).toBe(validAutoraceRaceId);
        }
    });

    it('不正なAutoraceRaceId', () => {
        const invalidAutoraceRaceIdAndMessage = [
            ['autoraceabc2021080101', 'AutoraceRaceIdの形式ではありません'],
            [
                'autorace2021autorace080101',
                'AutoraceRaceIdの形式ではありません',
            ],
            ['autorace202108010', 'AutoraceRaceIdの形式ではありません'],
            ['jra202108010101', 'autoraceから始まる必要があります'],
            [
                'autorace202108010113',
                'レース番号は1~12の範囲である必要があります',
            ],
        ];
        invalidAutoraceRaceIdAndMessage.forEach(([invalidId, message]) => {
            const result = AutoraceRaceIdSchema.safeParse(invalidId);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe(message);
            }
        });
    });
});

describe('AutoraceRacePlayerIdSchema', () => {
    it('正しいAutoraceRacePlayerId', () => {
        const validAutoraceRacePlayerId = 'autorace20210801010101';
        const result = AutoraceRacePlayerIdSchema.safeParse(
            validAutoraceRacePlayerId,
        );
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data).toBe(validAutoraceRacePlayerId);
        }
    });

    it('不正なAutoraceRacePlayerId', () => {
        const invalidAutoraceRacePlayerIdAndMessage = [
            [
                'autoraceabc202108010101',
                'AutoraceRacePlayerIdの形式ではありません',
            ],
            [
                'autorace2021autorace08010101',
                'AutoraceRacePlayerIdの形式ではありません',
            ],
            [
                'autorace202108010101',
                'AutoraceRacePlayerIdの形式ではありません',
            ],
            ['jra20210801010101', 'autoraceから始まる必要があります'],
            ['autorace20210801010113', '枠番は1~8の範囲である必要があります'],
        ];
        invalidAutoraceRacePlayerIdAndMessage.forEach(
            ([invalidId, message]) => {
                const result = AutoraceRacePlayerIdSchema.safeParse(invalidId);
                expect(result.success).toBe(false);
                if (!result.success) {
                    expect(result.error.issues[0].message).toBe(message);
                }
            },
        );
    });
});
