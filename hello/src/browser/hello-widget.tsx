import * as React from 'react';
import { injectable, postConstruct } from '@theia/core/shared/inversify';
import { ReactWidget } from '@theia/core/lib/browser/widgets/react-widget';
import { Message } from '@theia/core/lib/browser';

export type ConsoleLineType = 'normal' | 'error' | 'info' | 'command';

interface ConsoleLine {
    text: string;
    type: ConsoleLineType;
    timestamp: number;
}

@injectable()
export class HelloConsoleWidget extends ReactWidget {

    static readonly ID = 'axm-output';
    static readonly LABEL = 'AXM Output';

    protected lines: ConsoleLine[] = [];
    protected containerRef = React.createRef<HTMLDivElement>();
    protected autoScroll = true;

    @postConstruct()
    protected init(): void {
        this.id = HelloConsoleWidget.ID;
        this.title.label = HelloConsoleWidget.LABEL;
        this.title.caption = HelloConsoleWidget.LABEL;
        this.title.iconClass = 'fa fa-terminal';
        this.title.closable = true;
        this.addClass('axm-console-widget');
        this.update();
    }

    protected onActivateRequest(msg: Message): void {
        super.onActivateRequest(msg);
        this.containerRef.current?.focus();
    }

    protected onAfterShow(msg: Message): void {
        super.onAfterShow(msg);
        this.scrollToBottom();
    }

    /**
     * Append a normal output line. Supports multi-line text (splits on \n).
     */
    append(text: string, type: ConsoleLineType = 'normal'): void {
        const segments = text.split('\n');
        for (const segment of segments) {
            this.lines.push({
                text: segment,
                type,
                timestamp: Date.now()
            });
        }
        this.update();
    }

    /**
     * Append an error line (styled in red).
     */
    error(text: string): void {
        this.append(text, 'error');
    }

    /**
     * Append an informational line (e.g. "▶ Running: file.axm").
     */
    info(text: string): void {
        this.append(text, 'info');
    }

    /**
     * Append a command echo line (e.g. styled like a typed command).
     */
    command(text: string): void {
        this.append(text, 'command');
    }

    /**
     * Clear all console output.
     */
    clear(): void {
        this.lines = [];
        this.update();
    }

    protected onUpdateRequest(msg: Message): void {
        super.onUpdateRequest(msg);
        if (this.autoScroll) {
            this.scrollToBottom();
        }
    }

    protected scrollToBottom(): void {
        requestAnimationFrame(() => {
            const el = this.containerRef.current;
            if (el) {
                el.scrollTop = el.scrollHeight;
            }
        });
    }

    protected handleScroll = (e: React.UIEvent<HTMLDivElement>): void => {
        const el = e.currentTarget;
        const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 24;
        this.autoScroll = atBottom;
    };

    protected formatTimestamp(ts: number): string {
        const d = new Date(ts);
        const pad = (n: number): string => n.toString().padStart(2, '0');
        return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    }

    protected renderToolbar(): React.ReactNode {
        return (
            <div className="axm-console-toolbar">
                <span className="axm-console-title">AXM Output</span>
                <button
                    className="axm-console-clear-btn"
                    title="Clear console"
                    onClick={() => this.clear()}
                >
                    <i className="fa fa-trash" /> Clear
                </button>
            </div>
        );
    }

    protected render(): React.ReactNode {
        return (
            <div className="axm-console-root">
                {this.renderToolbar()}
                <div
                    className="axm-console"
                    tabIndex={0}
                    ref={this.containerRef}
                    onScroll={this.handleScroll}
                >
                    {this.lines.length === 0 && (
                        <div className="axm-console-placeholder">
                            No output yet. Run an AXM file to see results here.
                        </div>
                    )}
                    {this.lines.map((line, index) => (
                        <div
                            key={index}
                            className={`axm-console-line axm-console-line-${line.type}`}
                        >
                            <span className="axm-console-timestamp">
                                {this.formatTimestamp(line.timestamp)}
                            </span>
                            <span className="axm-console-text">{line.text}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}