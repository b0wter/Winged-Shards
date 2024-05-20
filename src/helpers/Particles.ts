export abstract class ParticleHelpers
{
    public static killEffect(scene: Phaser.Scene, x: number, y: number, scale: number = 1.0)
    {
        const particles = scene.add.particles(
            x,
            y,
            'particle_red_mini',
            {
                speed: 150,
                lifespan: 350,
                active: true,
                scale: scale,
                stopAfter: 40,
                frequency: 20,
                quantity: 5,
                alpha: {
                    onUpdate: (p, k, t, v) => Math.sqrt(1 - t)
                }
            });
        setTimeout(() => particles.destroy(), 500)
    }
}
