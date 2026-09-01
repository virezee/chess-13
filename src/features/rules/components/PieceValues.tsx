function Head({ columns }: { columns: string[] }) {
  return (
    <thead>
      <tr className='border-b border-line text-ink'>
        {columns.map((column, index) => (
          <th key={column} className={index === 0 ? 'py-1.5 text-left' : 'py-1.5 text-center'}>
            {column}
          </th>
        ))}
      </tr>
    </thead>
  )
}
function Row({
  piece,
  value,
  enhanced,
  restricted
}: {
  piece: string
  value?: string
  enhanced?: string
  restricted?: string
}) {
  return (
    <tr className='border-b border-line/50'>
      <td className='py-1.5'>{piece}</td>
      {value === undefined ? (
        <>
          <td className='py-1.5 text-center'>{enhanced}</td>
          <td className='py-1.5 text-center'>{restricted}</td>
        </>
      ) : (
        <td className='py-1.5 text-center' colSpan={2}>
          {value}
        </td>
      )}
    </tr>
  )
}
function ChessTable() {
  return (
    <table className='mx-auto mt-3 w-full max-w-100 text-[15px] leading-relaxed text-ink-dim'>
      <Head columns={['Piece', 'Value']} />
      <tbody>
        <Row piece='Pawn' value='1' />
        <Row piece='Knight' value='3' />
        <Row piece='Bishop' value='3' />
        <Row piece='Rook' value='5' />
        <Row piece='Queen' value='9' />
      </tbody>
    </table>
  )
}
function GameTable() {
  return (
    <table className='mx-auto mt-3 w-full max-w-100 text-[15px] leading-relaxed text-ink-dim'>
      <Head columns={['Piece', 'Enhanced', 'Restricted']} />
      <tbody>
        <Row piece='Pope' value='&#8734;' />
        <Row piece='Emperor' value='15' />
        <Row piece='Marshal' value='13' />
        <Row piece='Assassin' enhanced='10' restricted='7' />
        <Row piece='Sentinel' enhanced='9' restricted='6' />
        <Row piece='Mage' enhanced='8' restricted='5' />
        <Row piece='Herald' enhanced='7' restricted='5' />
        <Row piece='Templar' enhanced='7' restricted='5' />
        <Row piece='Legionary' enhanced='2' restricted='2' />
      </tbody>
    </table>
  )
}
export function PieceValues() {
  return (
    <section>
      <h2 className='font-reading text-[22px] leading-none text-ink'>Piece Values</h2>
      <p className='mt-3 text-[15px] leading-relaxed text-ink-dim'>
        Chess counts its own pieces in points, a pawn at 1, a knight or bishop at 3, a rook at 5 and
        a queen at 9. That is the scale everything here is read on.
      </p>
      <ChessTable />
      <p className='mt-3 text-[15px] leading-relaxed text-ink-dim'>
        The pieces of this game sit against those numbers. Most of them carry two, since the same
        piece is worth more enhanced than it is restricted.
      </p>
      <GameTable />
      <p className='mt-3 text-[15px] leading-relaxed text-ink-dim'>
        Both tables are judged by eye and nothing is calculated behind them. The 1, 3, 5 and 9 of
        chess is a convention rather than a measurement, and these figures are set against that
        convention the same way.
      </p>
      <p className='mt-2.5 text-[15px] leading-relaxed text-ink-dim'>
        The Pope carries no number, since you never trade it and losing it ends the game. The Pope,
        the Emperor and the Marshal hold one figure across both columns, because the zone does not
        touch the first two and the Marshal carries the zone with it. The Marshal number leaves the
        command zone out, so capturing one is worth more than the table says, because every piece it
        was enhancing turns restricted.
      </p>
    </section>
  )
}