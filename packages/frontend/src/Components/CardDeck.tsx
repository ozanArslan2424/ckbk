import { createContext, useContext, useEffect, useLayoutEffect, type ReactElement } from "react";
import { useState, useRef } from "react";

// Transform duration ms
const ANIM_DURATION_MS = 300;
// CSS easing function
const ANIM_EASING = "ease";
// Opacity duration is different
const ANIM_OPACITY_RATIO = 0.4;
// Combined transition style
const ANIM_TRANSITION = `transform ${ANIM_DURATION_MS}ms ${ANIM_EASING}, opacity ${ANIM_DURATION_MS * ANIM_OPACITY_RATIO}ms ${ANIM_EASING}`;

// Max num of cards visible behind the active
const CARD_NUM_CAP = 2;
// Base rotation unit in degrees
const ROT = 3;
// Degrees of rotation added per card depth in the fan
const FAN_ROTATE_PER_DEPTH = ROT / 3;
// X adjust per fan
const FAN_TRANSLATE_X_PER_DEPTH = ROT;
// Y adjust per fan
const FAN_TRANSLATE_Y_PER_DEPTH = -(ROT / 3);
// Scale adjust per fan
const FAN_SCALE_PER_DEPTH = 0.02;

// How far the active card slides as a percentage of its width
const EXIT_TRANSLATE_X_PCT = 18;
// Scale the active card shrinks to during exit
const EXIT_SCALE = 0.96;
// Opacity the active card fades to at the end of the exit
const EXIT_OPACITY = 0;

type CardDeckProps = {
	children: ReactElement[];
	onFinish?: () => void;
};

function cardStyle(
	i: number,
	index: number,
	dir: string,
	exiting: boolean,
	children: ReactElement[],
): React.CSSProperties {
	const isActive = i === index;
	const isBehind = i > index;
	const depth = i - index;
	if (!isBehind && !isActive) {
		return {
			position: "absolute",
			top: 0,
			left: 0,
			right: 0,
			zIndex: 0,
			pointerEvents: "none",
			opacity: 0,
			transition: ANIM_TRANSITION,
		};
	}
	if (isActive) {
		const sign = dir === "next" ? -1 : 1;
		const exitTransform = exiting
			? `translateX(${sign * EXIT_TRANSLATE_X_PCT}%) rotate(${sign * ROT}deg) scale(${EXIT_SCALE})`
			: "translateX(0) rotate(0deg) scale(1)";
		return {
			position: "relative",
			zIndex: children.length + 1,
			transformOrigin: "bottom center",
			transform: exitTransform,
			opacity: exiting ? EXIT_OPACITY : 1,
			pointerEvents: exiting ? "none" : "auto",
			transition: ANIM_TRANSITION,
		};
	}
	const visualDepth = exiting ? depth - 1 : depth;
	return {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		zIndex: children.length - depth,
		transformOrigin: "bottom center",
		transform: `translateX(${visualDepth * FAN_TRANSLATE_X_PER_DEPTH}px) translateY(${visualDepth * FAN_TRANSLATE_Y_PER_DEPTH}px) rotate(${visualDepth * FAN_ROTATE_PER_DEPTH}deg) scale(${1 - visualDepth * FAN_SCALE_PER_DEPTH})`,
		opacity: depth <= CARD_NUM_CAP ? 1 : 0,
		pointerEvents: "none",
		transition: ANIM_TRANSITION,
	};
}

type CardDeckContextValue = {
	onNext: () => void;
	onPrev: () => void;
};

const CardDeckContext = createContext<CardDeckContextValue | null>(null);

export function useCardDeckContext() {
	const ctx = useContext(CardDeckContext);
	// if (!ctx) throw new Error("useCardDeck must be used inside a CardDeck");
	return ctx;
}

export function CardDeck({ children, onFinish }: CardDeckProps) {
	const [index, setIndex] = useState(0);
	const [exiting, setExiting] = useState(false);
	const [dir, setDir] = useState<"next" | "prev">("next");
	const isAnimating = useRef(false);

	function move(to: "next" | "prev") {
		if (isAnimating.current) return;
		if (to === "next" && index === children.length - 1) {
			onFinish?.();
			return;
		}
		if (to === "prev" && index === 0) return;
		isAnimating.current = true;
		setDir(to);
		if (to === "next") setExiting(true);
		setTimeout(
			() => {
				setIndex((i) => (to === "next" ? i + 1 : i - 1));
				setExiting(false);
				isAnimating.current = false;
			},
			to === "next" ? ANIM_DURATION_MS : 0,
		);
	}

	const contextValue: CardDeckContextValue = {
		onNext: () => move("next"),
		onPrev: () => move("prev"),
	};

	return (
		<CardDeckContext.Provider value={contextValue}>
			<div className="relative" style={{ isolation: "isolate" }}>
				{children.map((child, i) => (
					<div key={i} style={cardStyle(i, index, dir, exiting, children)}>
						{child}
					</div>
				))}
			</div>
		</CardDeckContext.Provider>
	);
}

export function CardDeckScrollable({ children, onFinish }: CardDeckProps) {
	const [index, setIndex] = useState(0);
	const [exiting, setExiting] = useState(false);
	const [dir, setDir] = useState<"next" | "prev">("next");
	const isAnimating = useRef(false);

	function move(to: "next" | "prev") {
		if (isAnimating.current) return;
		if (to === "next" && index === children.length - 1) {
			onFinish?.();
			return;
		}
		if (to === "prev" && index === 0) return;
		isAnimating.current = true;
		setDir(to);
		if (to === "next") setExiting(true);
		setTimeout(
			() => {
				setIndex((i) => (to === "next" ? i + 1 : i - 1));
				setExiting(false);
				isAnimating.current = false;
			},
			to === "next" ? ANIM_DURATION_MS : 0,
		);
	}

	const contextValue: CardDeckContextValue = {
		onNext: () => move("next"),
		onPrev: () => move("prev"),
	};

	const wrapperRef = useRef<HTMLDivElement>(null);
	const accumulated = useRef(0);
	const moveRef = useRef(move);

	useLayoutEffect(() => {
		moveRef.current = move;
	});

	useEffect(() => {
		const el = wrapperRef.current;
		if (!el) return;
		const handleWheel = (e: WheelEvent) => {
			e.preventDefault();
			accumulated.current += e.deltaY;
			if (accumulated.current >= 50) {
				accumulated.current -= 50;
				moveRef.current("next");
			} else if (accumulated.current <= -50) {
				accumulated.current += 50;
				moveRef.current("prev");
			}
		};
		el.addEventListener("wheel", handleWheel, { passive: false });
		return () => el.removeEventListener("wheel", handleWheel);
	}, []);

	return (
		<CardDeckContext.Provider value={contextValue}>
			<div ref={wrapperRef} className="relative" style={{ isolation: "isolate" }}>
				{children.map((child, i) => (
					<div
						key={i}
						style={{
							...cardStyle(i, index, dir, exiting, children),
							width: "contents",
						}}
					>
						{child}
					</div>
				))}
			</div>
		</CardDeckContext.Provider>
	);
}
