export interface paths {
    "/auth/login": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 이메일/비밀번호 로그인
         * @description Supabase Auth 로그인.
         *
         *     Swagger 우측 상단 **Authorize** 버튼에서 username(=이메일)/password를 입력하면
         *     발급된 access_token이 이후 요청의 Authorization 헤더에 자동으로 붙는다.
         */
        post: operations["login_auth_login_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/signup": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 이메일/비밀번호 회원가입
         * @description 이메일과 비밀번호로 계정을 만든다. 성공하면 즉시 로그인 상태가 된다.
         *
         *     응답은 로그인(POST /auth/login)과 같은 형태다. 받은 access_token을 이후 요청의
         *     `Authorization: Bearer <token>` 헤더에 붙이면 바로 다른 API를 쓸 수 있다.
         *     프로필(온보딩)은 가입 후 `PUT /auth/me/profile`로 저장한다.
         *
         *     TODO: 이메일 인증. 현재 email 인증 안 함. 심화 프로젝트에서 진행.
         */
        post: operations["signup_auth_signup_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/refresh": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 세션 갱신 */
        post: operations["refresh_auth_refresh_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/logout": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 로그아웃 */
        post: operations["logout_auth_logout_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/me": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 현재 로그인 사용자와 프로필
         * @description 계정 정보와 온보딩 프로필을 함께 반환한다.
         *
         *     프로필 행이 없으면 기본값을 반환하고 DB에는 쓰지 않는다(조회는 부작용이 없다).
         */
        get: operations["me_auth_me_get"];
        put?: never;
        post?: never;
        /**
         * 회원 탈퇴
         * @description 계정을 영구 삭제한다. 되돌릴 수 없다.
         *
         *     모든 대화(채팅방·메시지·피드백)와 프로필·학습 목표가 함께 삭제되고 계정 자체가
         *     소멸한다. 성공은 본문 없이 204이며, 이후 기존 토큰으로는 어떤 API도 쓸 수 없다.
         */
        delete: operations["withdraw_auth_me_delete"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/me/profile": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * 프로필 전체 교체(없으면 생성)
         * @description 온보딩 프로필을 요청 본문으로 통째로 덮어쓴다.
         *
         *     learning_goals도 전체 교체다. 요청에 없는 목적은 삭제되고, 빈 배열이면 모두 해제된다.
         */
        put: operations["update_profile_auth_me_profile_put"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/health": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Health */
        get: operations["health_health_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/chat": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Chat
         * @description 사용자 질문과 페르소나를 LLM에 전달한다.
         */
        post: operations["chat_chat_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ask_gemini": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Ask Gemini
         * @description Gemini REST API에 시스템 지침, 입력 텍스트, 생성 설정을 전달한다.
         */
        post: operations["ask_gemini_ask_gemini_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/personas": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List Personas
         * @description 대화 상대 목록을 반환한다. 고르는 데 필요한 값만 담는다. (KAN-58)
         */
        get: operations["list_personas_personas_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/personas/{persona_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Persona
         * @description 대화 상대 단건을 반환한다. 관계·음성 등 상세 값까지 포함한다.
         */
        get: operations["get_persona_personas__persona_id__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/scenarios": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List Scenarios
         * @description 대화 시나리오 목록을 반환한다. 어떤 상황인지 알아볼 값만 담는다. (KAN-59)
         */
        get: operations["list_scenarios_scenarios_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/scenarios/{scenario_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Scenario
         * @description 시나리오 단건을 반환한다. 목표·종료조건·턴 상한까지 포함한다.
         */
        get: operations["get_scenario_scenarios__scenario_id__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/rooms": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List Rooms
         * @description 내 채팅방 목록을 최신순으로 반환한다. (KAN-61)
         *
         *     누구의 목록인지는 토큰이 정한다. 예전에는 `?user_id=`를 받았는데, 그러면 남의 id만
         *     알면 그 사람의 방 목록을 그대로 조회할 수 있었다.
         */
        get: operations["list_rooms_rooms_get"];
        put?: never;
        /**
         * Create Room
         * @description 채팅방을 생성한다. (KAN-60)
         *
         *     방 주인은 토큰의 사용자다. 본문으로 받지 않으므로 남의 이름으로 방을 만들 수 없다.
         *
         *     persona_id·scenario_id는 조회한 카탈로그 행의 id로 저장한다. 요청 값을 그대로 넣으면
         *     대소문자가 다른 값("Doyun")이 들어가 FK를 위반한다.
         */
        post: operations["create_room_rooms_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/rooms/{room_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /**
         * Delete Room
         * @description 내 채팅방을 지운다.
         *
         *     대화 내역과 피드백도 함께 사라진다(모델의 cascade). 되돌릴 수 없다 — 숨김 처리가
         *     아니라 실제 삭제다.
         *
         *     자유 수다 방을 지우면 그 상대의 자리가 비므로 같은 상대로 다시 만들 수 있다.
         *
         *     남의 방이나 없는 방은 똑같이 404다. 성공은 본문 없이 204.
         */
        delete: operations["delete_room_rooms__room_id__delete"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/voice/emotion-analysis": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Analyze Voice Emotion
         * @description 녹음 음성의 감정 비율과 상대가 받을 인상을 분석한다.
         */
        post: operations["analyze_voice_emotion_voice_emotion_analysis_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/rooms/{room_id}/turns/text": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Process Text Turn */
        post: operations["process_text_turn_rooms__room_id__turns_text_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/rooms/{room_id}/turns/voice": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Process Voice Turn */
        post: operations["process_voice_turn_rooms__room_id__turns_voice_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/rooms/{room_id}/audio/{filename}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get Generated Audio */
        get: operations["get_generated_audio_rooms__room_id__audio__filename__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/rooms/{room_id}/messages": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List Messages */
        get: operations["list_messages_rooms__room_id__messages_get"];
        put?: never;
        /**
         * Send Message
         * @description 기존 텍스트 메시지 API 호환 경로. 새 앱은 turns/text를 사용한다.
         */
        post: operations["send_message_rooms__room_id__messages_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/rooms/{room_id}/messages/{message_id}/audio": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get Message Audio */
        get: operations["get_message_audio_rooms__room_id__messages__message_id__audio_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/rooms/{room_id}/feedback": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Request Feedback
         * @description 기존 수동 피드백 API. 새 turns API는 피드백을 자동 반환한다.
         */
        post: operations["request_feedback_rooms__room_id__feedback_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        /**
         * AskGeminiRequest
         * @example {
         *       "contents": "선배님 안녕하세요",
         *       "generationConfig": {
         *         "maxOutputTokens": 1000,
         *         "temperature": 0.7
         *       },
         *       "systemInstruction": "당신의 이름은 도윤이고, 대학선배입니다. 한국어로 친절하게 답변하세요."
         *     }
         */
        AskGeminiRequest: {
            /** Systeminstruction */
            systemInstruction: string;
            /** Contents */
            contents: string;
            generationConfig?: components["schemas"]["GenerationConfig"] | null;
        };
        /**
         * AuthSessionResponse
         * @description Browser-visible auth response. Tokens live only in HttpOnly cookies.
         */
        AuthSessionResponse: {
            user: components["schemas"]["AuthUser"];
        };
        /**
         * AuthUser
         * @description 인증된 사용자(= Supabase auth.users).
         */
        AuthUser: {
            /** Id */
            id: string;
            /** Email */
            email?: string | null;
            /** Role */
            role?: string | null;
        };
        /** Body_login_auth_login_post */
        Body_login_auth_login_post: {
            /** Grant Type */
            grant_type?: string | null;
            /** Username */
            username: string;
            /**
             * Password
             * Format: password
             */
            password: string;
            /**
             * Scope
             * @default
             */
            scope: string;
            /** Client Id */
            client_id?: string | null;
            /**
             * Client Secret
             * Format: password
             */
            client_secret?: string | null;
        };
        /** CategoryScores */
        CategoryScores: {
            /** Honorifics */
            honorifics: number;
            /** Politeness */
            politeness: number;
            /** Context Fit */
            context_fit: number;
            /** Naturalness */
            naturalness: number;
        };
        /** ChatInputAnalysis */
        ChatInputAnalysis: {
            emotion: components["schemas"]["Emotion"];
            /** Inferred Style */
            inferred_style: string;
            /** Intent */
            intent: string;
        };
        /** ChatMessageListResponse */
        ChatMessageListResponse: {
            /** Messages */
            messages: components["schemas"]["ChatMessageResponse"][];
        };
        /** ChatMessageResponse */
        ChatMessageResponse: {
            /** Id */
            id: string;
            /** Role */
            role: string;
            /** Content */
            content: string;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /** Audio Url */
            audio_url?: string | null;
        };
        /** ChatRequest */
        ChatRequest: {
            /** Persona */
            persona: string;
            /** Question */
            question: string;
            analysis?: components["schemas"]["TextModelAnalysis"] | null;
        };
        /** ChatResponse */
        ChatResponse: {
            /** Answer */
            answer: string;
            /** Response Style */
            response_style?: string | null;
        };
        /**
         * ConversationResponse
         * @description 분석·페르소나 답변·TTS를 모두 포함하는 통합 응답.
         */
        ConversationResponse: {
            /**
             * Input Type
             * @enum {string}
             */
            input_type: "voice" | "text";
            /** Source Text */
            source_text: string;
            /** Persona */
            persona: string;
            analysis: components["schemas"]["UserInputAnalysis"];
            voice_emotion?: components["schemas"]["VoiceEmotionAnalysis"] | null;
            /** Answer */
            answer: string;
            /** Response Style */
            response_style: string;
            audio: components["schemas"]["EmotionTtsResponse"];
            /** Processing Time Ms */
            processing_time_ms: number;
        };
        /**
         * CreateRoomRequest
         * @description 방 주인은 요청 본문이 아니라 토큰에서 온다.
         *
         *     `user_id`를 본문으로 받으면 아무나 남의 id를 적어 그 사람 이름으로 방을 만들 수 있다.
         */
        CreateRoomRequest: {
            /** Persona Id */
            persona_id: string;
            /** Scenario Id */
            scenario_id?: string | null;
            /** Name */
            name: string;
        };
        /**
         * Emotion
         * @enum {string}
         */
        Emotion: "화남" | "기쁨" | "당황스러움" | "궁금" | "슬픔" | "보통";
        /** EmotionScore */
        EmotionScore: {
            /** Label */
            label: string;
            /** Percentage */
            percentage: number;
        };
        /**
         * EmotionTtsResponse
         * @description 생성 파일 위치와 재현에 필요한 실제 provider 설정을 담는 응답.
         */
        EmotionTtsResponse: {
            /** Text */
            text: string;
            /** Speaking Style */
            speaking_style: string;
            /** Audio Path */
            audio_path: string;
            /** Metadata Path */
            metadata_path: string;
            /** Tts Provider */
            tts_provider: string;
            /** Tts Model */
            tts_model: string;
            /** Voice Name */
            voice_name: string;
        };
        /** FeedbackIssue */
        FeedbackIssue: {
            /** Message Id */
            message_id: string;
            /** Original */
            original: string;
            /**
             * Category
             * @enum {string}
             */
            category: "honorifics" | "politeness" | "context_fit" | "naturalness";
            /** Explanation */
            explanation: string;
            /** Suggestion */
            suggestion: string;
        };
        /** FeedbackResponse */
        FeedbackResponse: {
            /** Score */
            score: number;
            category_scores: components["schemas"]["CategoryScores"];
            /** Summary */
            summary: string;
            /** Strengths */
            strengths: string[];
            /** Improvements */
            improvements: string[];
            /** Issues */
            issues: components["schemas"]["FeedbackIssue"][];
            /** Cached */
            cached: boolean;
        };
        /** FeedbackResult */
        FeedbackResult: {
            /** Score */
            score: number;
            category_scores: components["schemas"]["CategoryScores"];
            /** Summary */
            summary: string;
            /** Strengths */
            strengths: string[];
            /** Improvements */
            improvements: string[];
            /** Issues */
            issues: components["schemas"]["FeedbackIssue"][];
        };
        /**
         * Gender
         * @description 성별. 미응답을 허용하므로 컬럼 자체는 nullable.
         * @enum {string}
         */
        Gender: "male" | "female" | "other" | "prefer_not_to_say";
        /**
         * GenerationConfig
         * @description Gemini generateContent의 생성 설정.
         */
        GenerationConfig: {
            /** Temperature */
            temperature?: number | null;
            /** Topp */
            topP?: number | null;
            /** Topk */
            topK?: number | null;
            /** Maxoutputtokens */
            maxOutputTokens?: number | null;
            /** Candidatecount */
            candidateCount?: number | null;
            /** Stopsequences */
            stopSequences?: string[] | null;
            /** Responsemimetype */
            responseMimeType?: string | null;
        };
        /** HTTPValidationError */
        HTTPValidationError: {
            /** Detail */
            detail?: components["schemas"]["ValidationError"][];
        };
        /** HealthResponse */
        HealthResponse: {
            /** Status */
            status: string;
        };
        /**
         * LearningGoal
         * @description 주요 학습 목적(복수 선택). 선택된 값들은 user_learning_goals에 행으로 쌓인다.
         * @enum {string}
         */
        LearningGoal: "daily_conversation" | "business" | "travel" | "exam" | "culture" | "other";
        /** MeResponse */
        MeResponse: {
            user: components["schemas"]["AuthUser"];
            profile: components["schemas"]["ProfileResponse"];
        };
        /**
         * NativeLanguage
         * @description 모국어. 현재 서비스가 지원하는 값만 허용한다.
         *
         *     DB 컬럼(user_profiles.native_language)은 varchar 그대로이며 제약을 추가하지 않았다.
         *     지원 언어가 늘어나면 여기에 값을 추가하면 된다.
         * @enum {string}
         */
        NativeLanguage: "ko" | "en";
        /** PersonaListResponse */
        PersonaListResponse: {
            /** Personas */
            personas: components["schemas"]["PersonaSummaryResponse"][];
        };
        /**
         * PersonaResponse
         * @description 대화 상대 단건. 대화를 시작한 뒤에 필요한 값까지 포함한다.
         */
        PersonaResponse: {
            /**
             * Id
             * @description 채팅방 생성 시 persona_id로 그대로 보내는 식별자
             */
            id: string;
            /**
             * First Name
             * @description 이름. 화면 표시와 프롬프트 호칭에 쓰인다
             */
            first_name: string;
            /**
             * Middle Name
             * @description 없으면 이름 표기에서 생략한다
             */
            middle_name?: string | null;
            /**
             * Last Name
             * @description 없으면 이름 표기에서 생략한다
             */
            last_name?: string | null;
            /**
             * Age
             * @description 만 나이. 사용자와의 나이 차가 존댓말/반말을 가른다
             */
            age: number;
            /** @description 성별. 3인칭 표현과 음성 선택에 쓰인다 */
            gender: components["schemas"]["Gender"];
            /**
             * Description
             * @description 목록 화면에 보여 주는 한 줄 소개
             */
            description: string;
            /**
             * Avatar Url
             * @description 공개 페르소나 이미지 URL
             */
            avatar_url?: string | null;
            /**
             * Relationship Description
             * @description 사용자와의 관계. 호칭과 존대 수준을 정한다
             */
            relationship_description: string;
            /**
             * Version
             * Format: date-time
             * @description 정의가 마지막으로 바뀐 시각. 클라이언트 캐시 무효화에 쓴다
             */
            version: string;
            /**
             * Scenarios
             * @description 이 상대로 고를 수 있는 시나리오. id 오름차순. 빈 배열이면 아직 준비된 상황이 없다는 뜻이다. 여기 없는 조합으로 채팅방을 만들면 400이다
             */
            scenarios: components["schemas"]["ScenarioSummaryResponse"][];
        };
        /**
         * PersonaSummaryResponse
         * @description 대화 상대 목록의 원소. 상대를 고르는 데 필요한 값만 담는다.
         */
        PersonaSummaryResponse: {
            /**
             * Id
             * @description 채팅방 생성 시 persona_id로 그대로 보내는 식별자
             */
            id: string;
            /**
             * First Name
             * @description 이름. 화면 표시와 프롬프트 호칭에 쓰인다
             */
            first_name: string;
            /**
             * Middle Name
             * @description 없으면 이름 표기에서 생략한다
             */
            middle_name?: string | null;
            /**
             * Last Name
             * @description 없으면 이름 표기에서 생략한다
             */
            last_name?: string | null;
            /**
             * Age
             * @description 만 나이. 사용자와의 나이 차가 존댓말/반말을 가른다
             */
            age: number;
            /** @description 성별. 3인칭 표현과 음성 선택에 쓰인다 */
            gender: components["schemas"]["Gender"];
            /**
             * Description
             * @description 목록 화면에 보여 주는 한 줄 소개
             */
            description: string;
            /**
             * Avatar Url
             * @description 공개 페르소나 이미지 URL
             */
            avatar_url?: string | null;
        };
        /**
         * ProfileResponse
         * @description 온보딩 설정. 프로필 행이 없으면 모든 값이 비어 있는 기본값으로 응답한다.
         */
        ProfileResponse: {
            /** Name */
            name?: string | null;
            /** Age */
            age?: number | null;
            /** Learning Goal Other */
            learning_goal_other?: string | null;
            /** Native Language */
            native_language?: string | null;
            gender?: components["schemas"]["Gender"] | null;
            /**
             * Learning Goals
             * @default []
             */
            learning_goals: components["schemas"]["LearningGoal"][];
            study_frequency?: components["schemas"]["StudyFrequency"] | null;
            /**
             * Push Enabled
             * @default false
             */
            push_enabled: boolean;
            /** Updated At */
            updated_at?: string | null;
        };
        /**
         * ProfileUpdateRequest
         * @description 전체 교체(PUT). 다섯 필드를 모두 명시해야 하며, 값으로 null은 허용한다.
         */
        ProfileUpdateRequest: {
            /** Name */
            name?: string | null;
            /** Age */
            age?: number | null;
            /** Learning Goal Other */
            learning_goal_other?: string | null;
            native_language: components["schemas"]["NativeLanguage"] | null;
            gender: components["schemas"]["Gender"] | null;
            /** Learning Goals */
            learning_goals: components["schemas"]["LearningGoal"][];
            study_frequency: components["schemas"]["StudyFrequency"] | null;
            /** Push Enabled */
            push_enabled: boolean;
        };
        /** RoomListResponse */
        RoomListResponse: {
            /** Rooms */
            rooms: components["schemas"]["RoomResponse"][];
        };
        /** RoomResponse */
        RoomResponse: {
            /** Id */
            id: string;
            /** User Id */
            user_id: string | null;
            /** Guest */
            guest: boolean;
            /** Persona Id */
            persona_id: string;
            /** Scenario Id */
            scenario_id: string | null;
            /** Name */
            name: string;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /** Status */
            status: string;
            /** Turn Count */
            turn_count: number;
        };
        /** RoomTurnResponse */
        RoomTurnResponse: {
            conversation: components["schemas"]["ConversationResponse"];
            feedback: components["schemas"]["FeedbackResult"];
            /** Room Id */
            room_id: string;
            user_message: components["schemas"]["ChatMessageResponse"];
            assistant_message: components["schemas"]["ChatMessageResponse"];
        };
        /** ScenarioListResponse */
        ScenarioListResponse: {
            /** Scenarios */
            scenarios: components["schemas"]["ScenarioSummaryResponse"][];
        };
        /**
         * ScenarioResponse
         * @description 시나리오 단건. 대화 진행 규칙까지 포함한다.
         */
        ScenarioResponse: {
            /**
             * Id
             * @description 채팅방 생성 시 scenario_id로 그대로 보내는 식별자
             */
            id: string;
            /**
             * Description
             * @description 목록 화면에 보여 주는 한 줄 소개
             */
            description: string;
            /**
             * Time Context
             * @description 시간 배경. 없으면 시간을 표시하지 않는다
             */
            time_context?: string | null;
            /**
             * Place Context
             * @description 공간 배경. 없으면 장소를 표시하지 않는다
             */
            place_context?: string | null;
            /**
             * Communication Goal
             * @description 사용자가 달성해야 하는 의사소통 목표. 피드백 채점 기준이 된다
             */
            communication_goal: string;
            /**
             * End Condition
             * @description 대화를 끝내도 되는 조건
             */
            end_condition: string;
            /**
             * Max Turns
             * @description 턴 상한. 종료 조건이 걸리지 않아도 이 턴 수에서 마무리한다
             */
            max_turns: number;
            /**
             * Version
             * Format: date-time
             * @description 정의가 마지막으로 바뀐 시각. 클라이언트 캐시 무효화에 쓴다
             */
            version: string;
            /**
             * Personas
             * @description 이 상황을 연습할 수 있는 상대. id 오름차순
             */
            personas: components["schemas"]["PersonaSummaryResponse"][];
        };
        /**
         * ScenarioSummaryResponse
         * @description 시나리오 목록의 원소. 어떤 상황인지 알아보는 데 필요한 값만 담는다.
         */
        ScenarioSummaryResponse: {
            /**
             * Id
             * @description 채팅방 생성 시 scenario_id로 그대로 보내는 식별자
             */
            id: string;
            /**
             * Description
             * @description 목록 화면에 보여 주는 한 줄 소개
             */
            description: string;
            /**
             * Time Context
             * @description 시간 배경. 없으면 시간을 표시하지 않는다
             */
            time_context?: string | null;
            /**
             * Place Context
             * @description 공간 배경. 없으면 장소를 표시하지 않는다
             */
            place_context?: string | null;
        };
        /** SendMessageRequest */
        SendMessageRequest: {
            /** Question */
            question: string;
            analysis?: components["schemas"]["ChatInputAnalysis"] | null;
        };
        /** SendMessageResponse */
        SendMessageResponse: {
            /** Answer */
            answer: string;
            /** Response Style */
            response_style?: string | null;
            message: components["schemas"]["ChatMessageResponse"];
        };
        /**
         * SignupRequest
         * @description 회원가입 요청. email·password가 빈 문자열이거나 공백뿐이면 422로 거부한다.
         */
        SignupRequest: {
            /**
             * Email
             * @description 가입할 이메일. 형식 검증은 Supabase가 한다
             */
            email: string;
            /**
             * Password
             * @description 비밀번호. 길이·복잡도 정책은 Supabase가 검증한다(위반 시 400)
             */
            password: string;
        };
        /**
         * StudyFrequency
         * @description 학습 빈도(주당 목표).
         * @enum {string}
         */
        StudyFrequency: "daily" | "five_per_week" | "three_per_week" | "twice_per_week" | "weekly";
        /** TextModelAnalysis */
        TextModelAnalysis: {
            emotion: components["schemas"]["Emotion"];
            /** Inferred Style */
            inferred_style: string;
            /** Intent */
            intent: string;
        };
        /** TextRoomTurnRequest */
        TextRoomTurnRequest: {
            /** Text */
            text: string;
        };
        /** UserInputAnalysis */
        UserInputAnalysis: {
            /** User Text */
            user_text: string;
            user_emotion: components["schemas"]["Emotion"];
            /**
             * User Speaking Style
             * @description 음향 분석으로 관찰한 말투. 현재 텍스트 기반 분석에서는 null
             */
            user_speaking_style: string | null;
            /**
             * Inferred Style
             * @description 텍스트 표현과 맥락으로 추론한 말투
             */
            inferred_style?: string | null;
            /** User Intent */
            user_intent: string;
            /** Processing Time Ms */
            processing_time_ms?: number | null;
        };
        /** ValidationError */
        ValidationError: {
            /** Location */
            loc: (string | number)[];
            /** Message */
            msg: string;
            /** Error Type */
            type: string;
            /** Input */
            input?: unknown;
            /** Context */
            ctx?: Record<string, never>;
        };
        /** VoiceEmotionAnalysis */
        VoiceEmotionAnalysis: {
            /** Emotions */
            emotions: components["schemas"]["EmotionScore"][];
            /** Impressions */
            impressions: string[];
            /** Transcript */
            transcript: string;
            /** Model */
            model: string;
        };
        /** VoiceEmotionAnalysisRequest */
        VoiceEmotionAnalysisRequest: {
            /** Transcript */
            transcript: string;
            /** Audio Base64 */
            audio_base64: string;
            /** Audio Mime Type */
            audio_mime_type: string;
            /** Duration Seconds */
            duration_seconds?: number | null;
        };
        /** VoiceRoomTurnRequest */
        VoiceRoomTurnRequest: {
            /** Transcript */
            transcript: string;
            /** Audio Base64 */
            audio_base64: string;
            /** Audio Mime Type */
            audio_mime_type: string;
            /** Duration Seconds */
            duration_seconds?: number | null;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    login_auth_login_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/x-www-form-urlencoded": components["schemas"]["Body_login_auth_login_post"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AuthSessionResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    signup_auth_signup_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SignupRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AuthSessionResponse"];
                };
            };
            /** @description 비밀번호 정책 위반 또는 가입 거부 */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description 이미 가입된 이메일입니다. */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
            /** @description 인증 서버에 연결할 수 없습니다. */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Supabase 인증이 구성되지 않았거나, 이메일 확인(Confirm email)이 켜져 있어 가입 즉시 로그인할 수 없습니다. */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    refresh_auth_refresh_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: {
                refresh_token?: string | null;
            };
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AuthSessionResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    logout_auth_logout_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    me_auth_me_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MeResponse"];
                };
            };
        };
    };
    withdraw_auth_me_delete: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description 토큰이 없거나 만료되었습니다. */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description 회원 탈퇴 처리 중 인증 서버 오류가 발생했습니다. */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description SUPABASE_SERVICE_ROLE_KEY가 설정되지 않았습니다. */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    update_profile_auth_me_profile_put: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ProfileUpdateRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProfileResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    health_health_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HealthResponse"];
                };
            };
        };
    };
    chat_chat_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ChatRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ChatResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    ask_gemini_ask_gemini_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AskGeminiRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ChatResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_personas_personas_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PersonaListResponse"];
                };
            };
        };
    };
    get_persona_personas__persona_id__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                persona_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PersonaResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_scenarios_scenarios_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ScenarioListResponse"];
                };
            };
        };
    };
    get_scenario_scenarios__scenario_id__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                scenario_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ScenarioResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_rooms_rooms_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RoomListResponse"];
                };
            };
        };
    };
    create_room_rooms_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateRoomRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RoomResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    delete_room_rooms__room_id__delete: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                room_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    analyze_voice_emotion_voice_emotion_analysis_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["VoiceEmotionAnalysisRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["VoiceEmotionAnalysis"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    process_text_turn_rooms__room_id__turns_text_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                room_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["TextRoomTurnRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RoomTurnResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    process_voice_turn_rooms__room_id__turns_voice_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                room_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["VoiceRoomTurnRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RoomTurnResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_generated_audio_rooms__room_id__audio__filename__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                room_id: string;
                filename: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_messages_rooms__room_id__messages_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                room_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ChatMessageListResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    send_message_rooms__room_id__messages_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                room_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SendMessageRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SendMessageResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_message_audio_rooms__room_id__messages__message_id__audio_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                room_id: string;
                message_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    request_feedback_rooms__room_id__feedback_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                room_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FeedbackResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
}
