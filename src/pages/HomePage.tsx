import { Link } from "react-router-dom";

import { Badge } from "../components/Badge";
import { Button } from "../components/Button";

import "./HomePage.css";

export function HomePage() {
	return (
		<div className="home">
			<section className="hero">
				<div className="hero-copy">
					<Badge tone="accent">Est. 2019 · Neighborhood roaster</Badge>
					<h1>Coffee, made slow. Served fast.</h1>
					<p className="lede">
						Venceslau was here and made some changes, this is going to be a demo. Single-origin
						beans, house-made syrups, and pastries baked before the sun's up. Order ahead and skip
						the line.
					</p>
					<div className="hero-actions">
						<Link to="/menu">
							<Button size="lg">See the menu →</Button>
						</Link>
						<Link to="/about">
							<Button size="lg" variant="secondary">
								About us
							</Button>
						</Link>
					</div>
				</div>
				<div className="hero-art" aria-hidden="true">
					<div className="cup">
						<div className="cup-steam s1" />
						<div className="cup-steam s2" />
						<div className="cup-steam s3" />
						<div className="cup-body" />
						<div className="cup-handle" />
					</div>
				</div>
			</section>

			<section className="features">
				<div className="feature">
					<div className="feature-icon">🌱</div>
					<h3>Direct trade beans</h3>
					<p>Sourced from four farms we visit every year.</p>
				</div>
				<div className="feature">
					<div className="feature-icon">⏱️</div>
					<h3>Order ahead</h3>
					<p>Skip the queue — ready when you arrive.</p>
				</div>
				<div className="feature">
					<div className="feature-icon">🥐</div>
					<h3>Fresh pastries</h3>
					<p>Baked on-site starting at 5am, every day.</p>
				</div>
			</section>

			<section className="hours">
				<h2>Visit us</h2>
				<div className="hours-grid">
					<div>
						<strong>Address</strong>
						<div>221B Bean Street, Roasterville</div>
					</div>
					<div>
						<strong>Weekdays</strong>
						<div>6:30 – 18:00</div>
					</div>
					<div>
						<strong>Weekends</strong>
						<div>7:30 – 16:00</div>
					</div>
					<div>
						<strong>Phone</strong>
						<div>(555) 010-BREW</div>
					</div>
				</div>
			</section>
		</div>
	);
}
