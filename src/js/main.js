document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".nav-links a[data-section]");
  const sectionTriggers = document.querySelectorAll("a[data-section]");
  const pages = document.querySelectorAll(".page");
  let resetQuizToStart;
  const mobileBlocker = document.getElementById("mobile-blocker");

  const isMobileViewport = () => window.matchMedia("(max-width: 900px)").matches;

  const isMobileUserAgent = () =>
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      window.navigator.userAgent,
    );

  const updateMobileAccessState = () => {
    if (!mobileBlocker) {
      return;
    }

    const shouldBlock = isMobileViewport() || isMobileUserAgent();
    mobileBlocker.classList.toggle("mobile-blocker--visible", shouldBlock);
    document.body.classList.toggle("mobile-blocked", shouldBlock);
  };

  updateMobileAccessState();
  window.addEventListener("resize", updateMobileAccessState);
  window.addEventListener("orientationchange", updateMobileAccessState);

  const setActivePage = (targetSection) => {
    if (!targetSection) return;

    const matchingPage = Array.from(pages).find(
      (page) => page.dataset.section === targetSection,
    );

    if (!matchingPage) return;

    pages.forEach((page) => {
      const isActive = page === matchingPage;
      page.classList.toggle("page--active", isActive);
      page.setAttribute("aria-hidden", String(!isActive));
    });

    if (matchingPage) {
      const anchorTarget =
        matchingPage.querySelector(".page-anchor") ?? matchingPage;
      anchorTarget.scrollIntoView({ behavior: "smooth", block: "start" });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const hasMatchingPage = (targetSection) =>
    Array.from(pages).some((page) => page.dataset.section === targetSection);

  const updateNavLinks = (targetSection) => {
    navLinks.forEach((nav) => {
      const isActive = nav.dataset.section === targetSection;
      nav.classList.toggle("active", isActive);
    });
  };

  const handleSectionNavigation = (event, targetSection) => {
    if (event) {
      event.preventDefault();
    }

    if (!targetSection || !hasMatchingPage(targetSection)) {
      return;
    }

    updateNavLinks(targetSection);
    setActivePage(targetSection);
  };

  const attachSectionTrigger = (anchor) => {
    if (!anchor || anchor.dataset.sectionBound === "true") {
      return;
    }

    anchor.addEventListener("click", (event) => {
      if (
        anchor.dataset.section === "quiz" &&
        typeof resetQuizToStart === "function"
      ) {
        resetQuizToStart();
      }
      handleSectionNavigation(event, anchor.dataset.section);
    });

    anchor.dataset.sectionBound = "true";
  };

  const quizData = [
    {
      question: "Which mosquito spreads dengue fever?",
      options: ["Anopheles", "Aedes aegypti", "Culex", "All mosquitoes"],
      answer: 1,
      explanation:
        "Aedes aegypti is the primary mosquito that spreads dengue fever. It has distinctive white markings on its legs.",
    },
    {
      question: "When are dengue mosquitoes most active?",
      options: [
        "Only at night",
        "Early morning and evening",
        "Midday only",
        "All day equally",
      ],
      answer: 1,
      explanation:
        "Aedes mosquitoes are most active during early morning hours and before evening, though they can bite throughout the day.",
    },
    {
      question: "What is the most effective way to prevent dengue?",
      options: [
        "Taking vitamins",
        "Removing stagnant water",
        "Staying indoors all day",
        "Eating spicy food",
      ],
      answer: 1,
      explanation:
        "Removing stagnant water eliminates mosquito breeding sites, which is the most effective prevention method.",
    },
    {
      question:
        "How long does it take for dengue symptoms to appear after being bitten?",
      options: ["1-2 hours", "1-2 days", "4-7 days", "2-3 weeks"],
      answer: 2,
      explanation:
        "Dengue symptoms typically appear 4-7 days after being bitten by an infected mosquito.",
    },
    {
      question: "Which is NOT a common symptom of dengue?",
      options: [
        "High fever",
        "Severe headache",
        "Cough and cold",
        "Joint and muscle pain",
      ],
      answer: 2,
      explanation:
        "While dengue causes high fever, severe headache, and joint pain, cough and cold are not typical dengue symptoms.",
    },
    {
      question: "Where do Aedes mosquitoes typically lay their eggs?",
      options: [
        "In dirty swamps",
        "In clean stagnant water",
        "In flowing rivers",
        "On dry surfaces",
      ],
      answer: 1,
      explanation:
        "Aedes mosquitoes prefer to lay eggs in clean, stagnant water found in household containers.",
    },
    {
      question: "What should you do if you suspect you have dengue?",
      options: [
        "Wait and see",
        "Visit a doctor immediately",
        "Take aspirin",
        "Exercise more",
      ],
      answer: 1,
      explanation:
        "If you suspect dengue, visit a doctor immediately for proper diagnosis and treatment. Early medical care is crucial.",
    },
    {
      question: "Can dengue spread from person to person through touch?",
      options: [
        "Yes, always",
        "Yes, but rarely",
        "No, never",
        "Only in children",
      ],
      answer: 2,
      explanation:
        "Dengue does not spread from person to person through touch, air, or close contact. It only spreads through mosquito bites.",
    },
  ];

  const quizElements = {
    page: document.querySelector(".quiz-page"),
    wrapper: document.querySelector(".quiz-wrapper"),
    status: document.querySelector(".quiz-status-card"),
    card: document.querySelector(".quiz-card"),
    results: null,
    question: document.getElementById("quiz-question"),
    options: document.getElementById("quiz-options"),
    explanation: document.getElementById("quiz-explanation"),
    explanationText: document.getElementById("quiz-explanation-text"),
    next: document.getElementById("quiz-next"),
    restart: null,
    progress: document.getElementById("quiz-progress"),
    current: document.getElementById("quiz-current"),
    total: document.getElementById("quiz-total"),
    score: document.getElementById("quiz-score"),
    asked: document.getElementById("quiz-asked"),
    finalScore: null,
    finalTotal: null,
    resultMessage: null,
  };

  if (quizElements.page) {
    let currentQuestionIndex = 0;
    let answeredCount = 0;
    let score = 0;
    let questionAnswered = false;
    const totalQuestions = quizData.length;

    const toggleView = (view) => {
      const isQuestionView = view === "question";
      if (quizElements.card) {
        quizElements.card.hidden = !isQuestionView;
        quizElements.card.classList.toggle("is-hidden", !isQuestionView);
      }
      if (quizElements.status) {
        quizElements.status.hidden = !isQuestionView;
      }
      if (quizElements.results) {
        quizElements.results.hidden = isQuestionView;
        quizElements.results.classList.toggle("is-hidden", isQuestionView);
      }
      if (quizElements.next && !isQuestionView) {
        quizElements.next.classList.add("is-hidden");
        quizElements.next.disabled = true;
      }
    };

    const updateStatus = () => {
      quizElements.current.textContent = (currentQuestionIndex + 1).toString();
      quizElements.total.textContent = totalQuestions.toString();
      quizElements.score.textContent = score.toString();
      quizElements.asked.textContent = answeredCount.toString();
      if (quizElements.finalTotal) {
        quizElements.finalTotal.textContent = totalQuestions.toString();
      }
    };

    const updateProgress = () => {
      const percentage = totalQuestions
        ? Math.min(100, (answeredCount / totalQuestions) * 100)
        : 0;
      quizElements.progress.style.width = `${percentage}%`;
    };

    function ensureResultsElement() {
      if (quizElements.results || !quizElements.wrapper) {
        return;
      }

      const section = document.createElement("section");
      section.className = "quiz-results";
      section.dataset.view = "results";
      section.hidden = true;
      section.setAttribute("aria-live", "polite");
      section.innerHTML = `
        <div class="quiz-result-icon" aria-hidden="true">🏆</div>
        <h2>Quiz Complete!</h2>
        <p class="quiz-result-score">
          <span id="quiz-final-score">0</span>/<span id="quiz-final-total">0</span>
        </p>
        <p class="quiz-result-message" id="quiz-result-message">
          Great effort! Keep learning to become a dengue prevention hero.
        </p>
        <button type="button" class="btn btn-success quiz-restart" id="quiz-restart">
          Try Again
        </button>
        <p class="quiz-result-links-label">Want to learn more?</p>
        <div class="quiz-result-links">
          <a href="#" class="quiz-result-link quiz-result-link--about" data-section="about">
            About Dengue
          </a>
          <span aria-hidden="true">•</span>
          <a href="#" class="quiz-result-link quiz-result-link--symptoms" data-section="symptoms">
            Symptoms
          </a>
          <span aria-hidden="true">•</span>
          <a href="#" class="quiz-result-link quiz-result-link--prevention" data-section="prevention">
            Prevention
          </a>
        </div>
      `;

      quizElements.wrapper.appendChild(section);
      quizElements.results = section;
      quizElements.finalScore = section.querySelector("#quiz-final-score");
      quizElements.finalTotal = section.querySelector("#quiz-final-total");
      quizElements.resultMessage = section.querySelector(
        "#quiz-result-message",
      );
      quizElements.restart = section.querySelector("#quiz-restart");

      section.querySelectorAll("a[data-section]").forEach(attachSectionTrigger);

      if (quizElements.restart) {
        quizElements.restart.addEventListener("click", () => {
          resetQuiz();
        });
      }

      if (quizElements.finalTotal) {
        quizElements.finalTotal.textContent = totalQuestions.toString();
      }
    }

    const getResultMessage = () => {
      const ratio = totalQuestions ? score / totalQuestions : 0;
      if (ratio === 1) {
        return "Outstanding! You're a dengue prevention champion! 🏅";
      }
      if (ratio >= 0.75) {
        return "Great job! You really know how to stop dengue. 🌟";
      }
      if (ratio >= 0.5) {
        return "Nice effort! Review the tips and try again soon. 💪";
      }
      return "Keep trying! Review the information and try again! 💪";
    };

    const shuffleArray = (array) => {
      const result = [...array];
      for (let i = result.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
      }
      return result;
    };

    const renderQuestion = () => {
      const quizItem = quizData[currentQuestionIndex];
      questionAnswered = false;

      const nextLabel =
        currentQuestionIndex === totalQuestions - 1
          ? "See Results"
          : "Next Question";

      quizElements.question.textContent = quizItem.question;
      quizElements.options.innerHTML = "";
      if (quizElements.explanation) {
        quizElements.explanation.classList.remove("is-visible");
        quizElements.explanation.hidden = true;
      }
      quizElements.explanationText.textContent = quizItem.explanation;

      const shuffledOptions = shuffleArray(
        quizItem.options.map((option, index) => ({ option, index })),
      );

      shuffledOptions.forEach(({ option, index }) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "quiz-option";
        button.textContent = option;
        button.dataset.index = index.toString();

        button.addEventListener("click", () => {
          if (questionAnswered) {
            return;
          }

          button.classList.add("is-selected");
          questionAnswered = true;
          const correctIndex = quizItem.answer;
          const selectedIndex = Number(button.dataset.index);
          const isCorrect = selectedIndex === correctIndex;

          quizElements.options
            .querySelectorAll("button")
            .forEach((optionButton) => {
              const optionIndex = Number(optionButton.dataset.index);
              if (optionIndex === correctIndex) {
                optionButton.classList.add("is-correct");
              }
              if (optionIndex === selectedIndex && !isCorrect) {
                optionButton.classList.add("is-incorrect");
              }
              optionButton.disabled = true;
            });

          if (isCorrect) {
            score += 1;
          }
          answeredCount = Math.max(answeredCount, currentQuestionIndex + 1);

          quizElements.score.textContent = score.toString();
          quizElements.asked.textContent = answeredCount.toString();
          if (quizElements.explanation) {
            quizElements.explanation.hidden = false;
            void quizElements.explanation.offsetWidth;
            quizElements.explanation.classList.add("is-visible");
          }
          if (quizElements.next) {
            quizElements.next.disabled = false;
            quizElements.next.classList.remove("is-hidden");
            quizElements.next.textContent = nextLabel;
          }

          updateProgress();
        });

        quizElements.options.appendChild(button);
      });

      if (quizElements.next) {
        quizElements.next.disabled = true;
        quizElements.next.classList.add("is-hidden");
        quizElements.next.textContent = nextLabel;
      }

      updateStatus();
      updateProgress();
    };

    const showResults = () => {
      ensureResultsElement();
      toggleView("results");
      if (quizElements.finalScore) {
        quizElements.finalScore.textContent = score.toString();
      }
      if (quizElements.finalTotal) {
        quizElements.finalTotal.textContent = totalQuestions.toString();
      }
      if (quizElements.resultMessage) {
        quizElements.resultMessage.textContent = getResultMessage();
      }
    };

    const goToNextQuestion = () => {
      if (!questionAnswered) {
        return;
      }

      if (currentQuestionIndex < totalQuestions - 1) {
        currentQuestionIndex += 1;
        renderQuestion();
      } else {
        showResults();
      }
    };

    const resetQuiz = () => {
      currentQuestionIndex = 0;
      answeredCount = 0;
      score = 0;
      questionAnswered = false;
      toggleView("question");
      renderQuestion();
    };

    resetQuizToStart = resetQuiz;

    quizElements.next?.addEventListener("click", goToNextQuestion);

    renderQuestion();
  }

  sectionTriggers.forEach(attachSectionTrigger);

  const initialPage =
    document.querySelector(".page.page--active")?.dataset.section || "home";
  handleSectionNavigation(null, initialPage);
});
